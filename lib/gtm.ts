declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Helper to ensure window.dataLayer exists and safely push an event object.
 */
export const pushToDataLayer = (payload: Record<string, any>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

/**
 * 1. Track Page View
 * Pushes standard page_view event to DataLayer.
 */
export const trackPageView = (
  pageLocation?: string,
  pagePath?: string,
  pageTitle?: string
) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_view",
    page_location: pageLocation || window.location.href,
    page_path: pagePath || window.location.pathname,
    page_title: pageTitle || document.title,
  });
};

/**
 * 2. Track Product View (view_item)
 * Pushes view_item ecommerce event when a user views a single product page.
 */
export const trackViewItem = (product: {
  id?: string | number;
  _id?: string | number;
  name?: string;
  title?: string;
  price?: number;
  discountPrice?: number;
  category?: string;
}) => {
  if (typeof window === "undefined" || !product) return;

  const itemId = product.id || product._id || "";
  const itemName = product.name || product.title || "Product";
  const itemPrice = Number(product.discountPrice ?? product.price ?? 0);

  window.dataLayer = window.dataLayer || [];
  // Clear previous ecommerce object to prevent GA4 parameter pollution
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: "INR",
      value: itemPrice,
      items: [
        {
          item_id: String(itemId),
          item_name: itemName,
          price: itemPrice,
          quantity: 1,
        },
      ],
    },
  });
};

/**
 * 3. Track Add to Cart (add_to_cart)
 * Pushes add_to_cart ecommerce event when a user adds items to the cart or clicks buy now.
 */
export const trackAddToCart = (
  product: {
    id?: string | number;
    _id?: string | number;
    name?: string;
    title?: string;
    price?: number;
    discountPrice?: number;
    category?: string;
  },
  quantity: number = 1
) => {
  if (typeof window === "undefined" || !product) return;

  const itemId = product.id || product._id || "";
  const itemName = product.name || product.title || "Product";
  const itemPrice = Number(product.discountPrice ?? product.price ?? 0);
  const qty = Math.max(1, Number(quantity) || 1);
  const totalValue = itemPrice * qty;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "INR",
      value: totalValue,
      items: [
        {
          item_id: String(itemId),
          item_name: itemName,
          price: itemPrice,
          quantity: qty,
        },
      ],
    },
  });
};

/**
 * 4. Track Cart View (view_cart)
 * Pushes view_cart ecommerce event when a user views their shopping cart.
 */
export const trackViewCart = (
  cartItems: any[],
  cartTotal?: number
) => {
  if (typeof window === "undefined" || !cartItems || cartItems.length === 0) return;

  const formattedItems = cartItems.map((item: any) => {
    const itemId =
      item.productId ||
      item.product_id ||
      item.id ||
      item._id ||
      item.cartItemId ||
      "";
    const itemName = item.name || item.title || item.productName || "Product";
    const itemPrice = Number(
      item.discountPrice ?? item.price ?? item.unitPrice ?? 0
    );
    const quantity = Number(item.quantity ?? 1);

    return {
      item_id: String(itemId),
      item_name: itemName,
      price: itemPrice,
      quantity: quantity,
    };
  });

  const totalValue =
    cartTotal !== undefined
      ? Number(cartTotal)
      : formattedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "view_cart",
    ecommerce: {
      currency: "INR",
      value: totalValue,
      items: formattedItems,
    },
  });
};

/**
 * 5. Track Begin Checkout (begin_checkout)
 * Pushes begin_checkout ecommerce event when a user proceeds to checkout.
 */
export const trackBeginCheckout = (
  cartItems: any[],
  cartTotal?: number
) => {
  if (typeof window === "undefined" || !cartItems || cartItems.length === 0) return;

  const formattedItems = cartItems.map((item: any) => {
    const itemId =
      item.productId ||
      item.product_id ||
      item.id ||
      item._id ||
      item.cartItemId ||
      "";
    const itemName = item.name || item.title || item.productName || "Product";
    const itemPrice = Number(
      item.discountPrice ?? item.price ?? item.unitPrice ?? 0
    );
    const quantity = Number(item.quantity ?? 1);

    return {
      item_id: String(itemId),
      item_name: itemName,
      price: itemPrice,
      quantity: quantity,
    };
  });

  const totalValue =
    cartTotal !== undefined
      ? Number(cartTotal)
      : formattedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "INR",
      value: totalValue,
      items: formattedItems,
    },
  });
};

/**
 * 6. Track Purchase (purchase)
 * Pushes final purchase ecommerce event upon successful order placement (COD or Prepaid).
 */
export const trackPurchase = (
  order: {
    id?: string | number;
    order_id?: string | number;
    _id?: string | number;
    total?: number;
    amount?: number;
    tax?: number;
    shipping?: number;
    items?: any[];
    paymentMethod?: string;
  },
  cartItems?: any[]
) => {
  if (typeof window === "undefined" || !order) return;

  const transactionId =
    order.order_id || order.id || order._id || `order_${Date.now()}`;
  const totalValue = Number(order.amount ?? order.total ?? 0);
  const taxValue = Number(order.tax ?? 0);
  const shippingValue = Number(
    order.shipping ?? (order.paymentMethod === "cod" ? 50 : 0)
  );

  const rawItems =
    cartItems && cartItems.length > 0
      ? cartItems
      : Array.isArray(order.items)
      ? order.items
      : [];

  const formattedItems = rawItems.map((item: any) => {
    const itemId =
      item.productId ||
      item.product_id ||
      item.id ||
      item._id ||
      item.cartItemId ||
      "";
    const itemName = item.name || item.title || item.productName || "Product";
    const itemPrice = Number(
      item.price ?? item.discountPrice ?? item.unitPrice ?? 0
    );
    const quantity = Number(item.quantity ?? 1);

    return {
      item_id: String(itemId),
      item_name: itemName,
      price: itemPrice,
      quantity: quantity,
    };
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: String(transactionId),
      value: totalValue,
      tax: taxValue,
      shipping: shippingValue,
      currency: "INR",
      items: formattedItems,
    },
  });
};

/**
 * 7. Track User Verified (user_verified)
 * Pushes user_verified event to DataLayer when user verifies their mobile number.
 */
export const trackUserVerified = (userId: string | number) => {
  if (typeof window === "undefined" || !userId) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "user_verified",
    user_id: String(userId),
  });
};

