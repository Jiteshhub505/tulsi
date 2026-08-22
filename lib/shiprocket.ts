import axios from "axios";
import { format } from "date-fns";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obtain or reuse cached Shiprocket JWT Auth Token
 */
export async function getShiprocketToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedToken && tokenExpiresAt > now + 60 * 1000) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD) are missing in environment variables.");
  }

  try {
    const res = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email: email.trim(),
      password: password.trim(),
    });

    if (res.data?.token) {
      cachedToken = res.data.token;
      // Shiprocket tokens are valid for ~10 days. We cache for 7 days safely.
      tokenExpiresAt = now + 7 * 24 * 60 * 60 * 1000;
      return cachedToken as string;
    }

    throw new Error(res.data?.message || "Failed to retrieve Shiprocket auth token.");
  } catch (error: any) {
    console.error("Shiprocket Login Error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Shiprocket authentication failed");
  }
}

/**
 * Authorized HTTP request helper for Shiprocket API
 */
async function shiprocketRequest<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  data?: any,
  params?: any
): Promise<T> {
  let token = await getShiprocketToken();

  const makeReq = async (authToken: string) => {
    return axios({
      method,
      url: `${SHIPROCKET_BASE_URL}${path}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data,
      params,
    });
  };

  try {
    const res = await makeReq(token);
    return res.data;
  } catch (error: any) {
    // If 401 Unauthorized, refresh token once and retry
    if (error?.response?.status === 401) {
      token = await getShiprocketToken(true);
      const res = await makeReq(token);
      return res.data;
    }
    throw error;
  }
}

export interface ShiprocketOrderItem {
  name: string;
  sku?: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: number | string;
}

export interface CreateShiprocketOrderPayload {
  order_id: string;
  order_date?: Date | string;
  pickup_location?: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country?: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing?: boolean;
  order_items: ShiprocketOrderItem[];
  payment_method: "COD" | "Prepaid";
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
}

/**
 * 1. Create Adhoc Order in Shiprocket
 */
export async function createShiprocketOrder(payload: CreateShiprocketOrderPayload) {
  const pickupLocation =
    payload.pickup_location ||
    process.env.SHIPROCKET_PICKUP_LOCATION ||
    "work";

  const orderDateStr = payload.order_date
    ? typeof payload.order_date === "string"
      ? payload.order_date
      : format(payload.order_date, "yyyy-MM-dd HH:mm")
    : format(new Date(), "yyyy-MM-dd HH:mm");

  // Format customer names safely
  const nameParts = (payload.billing_customer_name || "Customer").trim().split(" ");
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Format phone (Shiprocket requires valid digits)
  const cleanPhone = (payload.billing_phone || "9999999999").replace(/\D/g, "").slice(-10);

  const formattedPayload = {
    order_id: payload.order_id,
    order_date: orderDateStr,
    pickup_location: pickupLocation,
    channel_id: payload.channel_id || "",
    comment: payload.comment || "Tulsi Veda Ayurvedic Order",
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: (payload.billing_address || "Address").slice(0, 190),
    billing_address_2: (payload.billing_address_2 || "").slice(0, 190),
    billing_city: payload.billing_city || "Delhi",
    billing_pincode: (payload.billing_pincode || "110001").toString().replace(/\D/g, "").slice(0, 6),
    billing_state: payload.billing_state || "Delhi",
    billing_country: payload.billing_country || "India",
    billing_email: payload.billing_email || "customer@tulsiveda.in",
    billing_phone: cleanPhone,
    shipping_is_billing: payload.shipping_is_billing ?? true,
    order_items: payload.order_items.map((item, idx) => ({
      name: item.name || `Product ${idx + 1}`,
      sku: item.sku || `SKU-${idx + 1}`,
      units: Number(item.units) || 1,
      selling_price: Number(item.selling_price) || 0,
      discount: Number(item.discount) || 0,
      tax: Number(item.tax) || 0,
      hsn: item.hsn || "",
    })),
    payment_method: payload.payment_method,
    shipping_charges: payload.shipping_charges ?? 0,
    giftwrap_charges: payload.giftwrap_charges ?? 0,
    transaction_charges: payload.transaction_charges ?? 0,
    total_discount: payload.total_discount ?? 0,
    sub_total: Number(payload.sub_total) || 0,
    length: Number(payload.length) || 15,
    breadth: Number(payload.breadth) || 10,
    height: Number(payload.height) || 5,
    weight: Number(payload.weight) || 0.5,
  };

  const response = await shiprocketRequest(
    "POST",
    "/orders/create/adhoc",
    formattedPayload
  );

  return response;
}

/**
 * 2. Assign Courier & Generate AWB Code
 */
export async function assignCourierAWB(shipmentId: number | string, courierId?: number | string) {
  const payload: any = {
    shipment_id: shipmentId,
  };
  if (courierId) {
    payload.courier_id = courierId;
  }

  const response = await shiprocketRequest("POST", "/courier/assign/awb", payload);
  return response;
}

/**
 * 3. Request Pickup for Shipment
 */
export async function requestPickup(shipmentId: number | string, pickupDate?: string) {
  const payload: any = {
    shipment_id: [Number(shipmentId)],
  };
  if (pickupDate) {
    payload.pickup_date = [pickupDate];
  }

  const response = await shiprocketRequest("POST", "/courier/generate/pickup", payload);
  return response;
}

/**
 * 4. Generate Shipping Label PDF
 */
export async function generateShippingLabel(shipmentIds: (number | string)[]) {
  const ids = shipmentIds.map((id) => Number(id));
  const response = await shiprocketRequest("POST", "/courier/generate/label", {
    shipment_id: ids,
  });
  return response;
}

/**
 * 5. Generate Tax Invoice PDF
 */
export async function generateInvoice(orderIds: (number | string)[]) {
  const ids = orderIds.map((id) => Number(id));
  const response = await shiprocketRequest("POST", "/orders/print/invoice", {
    ids: ids,
  });
  return response;
}

/**
 * 6. Track Shipment Status (by Shipment ID or AWB Code)
 */
export async function trackShipment(identifier: { shipmentId?: number | string; awbCode?: string }) {
  if (identifier.awbCode) {
    return await shiprocketRequest("GET", `/courier/track/awb/${identifier.awbCode}`);
  }
  if (identifier.shipmentId) {
    return await shiprocketRequest("GET", `/courier/track/shipment/${identifier.shipmentId}`);
  }
  throw new Error("Either shipmentId or awbCode must be provided to track shipment.");
}

/**
 * 7. Track by Order ID
 */
export async function trackByOrderId(orderId: string | number) {
  return await shiprocketRequest("GET", `/courier/track`, null, { order_id: orderId });
}

/**
 * 8. Cancel Shiprocket Order
 */
export async function cancelShiprocketOrder(shiprocketOrderIds: (number | string)[]) {
  const ids = shiprocketOrderIds.map((id) => Number(id));
  return await shiprocketRequest("POST", "/orders/cancel", {
    ids: ids,
  });
}

/**
 * 9. Check Courier Serviceability & Delivery ETA
 */
export async function checkPincodeServiceability({
  pickupPostcode = "110001",
  deliveryPostcode,
  weight = 0.5,
  cod = 0,
}: {
  pickupPostcode?: string;
  deliveryPostcode: string;
  weight?: number;
  cod?: 0 | 1;
}) {
  return await shiprocketRequest("GET", `/courier/serviceability/`, null, {
    pickup_postcode: pickupPostcode,
    delivery_postcode: deliveryPostcode,
    weight: weight.toString(),
    cod: cod.toString(),
  });
}

/**
 * Helper to sync Tulsi Veda Order with Shiprocket
 */
export async function syncOrderToShiprocket(order: any, orderItems: any[], products: any[]) {
  const items: ShiprocketOrderItem[] = orderItems.map((item) => {
    const product = products.find((p) => (p._id || p.id) === item.product_id);
    return {
      name: product?.name || product?.title || "Tulsi Veda Wellness Product",
      sku: product?._id || product?.id || `SKU-${item.product_id}`,
      units: item.quantity || 1,
      selling_price: item.price || 0,
      discount: 0,
      tax: 0,
      hsn: "",
    };
  });

  const isCod = order.paymentMethod?.toLowerCase() === "cod";

  const response = await createShiprocketOrder({
    order_id: order.order_id,
    order_date: order.createdAt || new Date(),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "work",
    billing_customer_name: order.shippingDetails?.fullName || "Valued Customer",
    billing_address: order.shippingDetails?.street || "Address",
    billing_city: order.shippingDetails?.city || "Delhi",
    billing_state: order.shippingDetails?.state || "Delhi",
    billing_pincode: order.shippingDetails?.pinCode || "110001",
    billing_country: "India",
    billing_email: order.shippingDetails?.email || "customer@tulsiveda.in",
    billing_phone: order.shippingDetails?.phone || "9999999999",
    payment_method: isCod ? "COD" : "Prepaid",
    sub_total: order.amount,
    order_items: items,
    weight: 0.5,
  });

  return response;
}

/**
 * 10. Auto-Fetch Customer Address by Phone Number from Shiprocket Database
 */
export async function fetchAddressFromShiprocket(phone: string) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) return null;

  try {
    const res = await shiprocketRequest("GET", "/orders", null, {
      search: cleanPhone,
    });

    const orders = res?.data || [];
    if (Array.isArray(orders) && orders.length > 0) {
      const validOrder = orders.find((o: any) => {
        const orderPhone = (o.customer_phone_unmasked || o.customer_phone || "").replace(/\D/g, "").slice(-10);
        return orderPhone === cleanPhone && o.customer_address;
      });

      if (validOrder && validOrder.customer_address) {
        const fullStreet = [validOrder.customer_address, validOrder.customer_address_2]
          .filter(Boolean)
          .join(", ")
          .trim();

        return {
          fullName: validOrder.customer_name || "",
          email: validOrder.customer_email || "",
          phone: cleanPhone,
          street: fullStreet,
          city: validOrder.customer_city || "",
          state: validOrder.customer_state || "",
          pinCode: (validOrder.customer_pincode || "").toString().slice(0, 6),
          source: "shiprocket_database",
        };
      }
    }
    return null;
  } catch (error: any) {
    console.error("Fetch Address from Shiprocket Error:", error?.response?.data || error.message);
    return null;
  }
}

