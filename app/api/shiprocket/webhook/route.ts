import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";

export async function POST(req: Request) {
  await connectDB();

  try {
    const rawBody = await req.json().catch(() => ({}));
    const headers = req.headers;
    const webhookToken = headers.get("x-api-key") || headers.get("authorization");

    // Optional secret verification if configured
    const expectedSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    if (expectedSecret && expectedSecret !== "optional_webhook_secret_key" && webhookToken !== expectedSecret) {
      console.warn("Shiprocket Webhook: Invalid or unauthorized token attempt.");
    }

    const {
      order_id,
      shipment_id,
      awb,
      current_status,
      current_status_id,
      courier_name,
      scans,
      pickup_token_number,
      pickup_scheduled_date,
    } = rawBody;

    if (!order_id && !shipment_id && !awb) {
      return NextResponse.json({ success: true, message: "Webhook acknowledged without target identifier" });
    }

    // Find corresponding order in database
    const query: any = {};
    if (order_id) {
      query.$or = [{ order_id: order_id }, { "shiprocket.orderId": order_id }];
    } else if (shipment_id) {
      query["shiprocket.shipmentId"] = shipment_id;
    } else if (awb) {
      query["shiprocket.awbCode"] = awb;
    }

    const order = await Order.findOne(query);

    if (order) {
      const formattedHistory = Array.isArray(scans)
        ? scans.map((s: any) => ({
            date: s.date || s.time || new Date().toISOString(),
            status: s.status || s.activity || current_status || "",
            activity: s.activity || s.status || "",
            location: s.location || "",
          }))
        : [];

      order.shiprocket = {
        ...order.shiprocket,
        awbCode: awb || order.shiprocket?.awbCode,
        courierName: courier_name || order.shiprocket?.courierName,
        status: current_status || order.shiprocket?.status,
        statusCode: current_status_id || order.shiprocket?.statusCode,
        pickupTokenNumber: pickup_token_number || order.shiprocket?.pickupTokenNumber,
        pickupScheduledDate: pickup_scheduled_date || order.shiprocket?.pickupScheduledDate,
        lastTrackingUpdate: new Date(),
        trackingHistory:
          formattedHistory.length > 0
            ? formattedHistory
            : order.shiprocket?.trackingHistory || [],
      };

      // If delivered, can update main status if applicable
      if (current_status?.toLowerCase() === "delivered") {
        order.updatedAt = new Date();
      }

      await order.save();
      console.log(`Shiprocket Webhook: Order ${order.order_id} updated with status ${current_status}`);
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("SHIPROCKET_WEBHOOK_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
