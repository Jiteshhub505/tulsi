import connectDB from "@/db/mongoose";
import { CartItem, Product } from "@/db/models";

/**
 * Calculates final payable amount for a cart
 * - Uses DB prices (secure)
 * - Respects quantity
 * - Applies discount correctly
 * - Applies tax ONCE
 */
export const getProductsById = async (cartId: string) => {
  await connectDB();

  // 1️⃣ Fetch cart items (productId + quantity)
  const cartRows = await CartItem.find({ cartId }).lean();

  if (cartRows.length === 0) return 0;

  // 2️⃣ Extract product IDs
  const productIds = cartRows.map((c) => c.productId);

  // 3️⃣ Fetch product prices
  const productRows = await Product.find({ _id: { $in: productIds } }).lean();

  // 4️⃣ Create quick lookup for quantity
  const quantityMap = new Map<string, number>();
  for (const item of cartRows) {
    quantityMap.set(item.productId, item.quantity);
  }

  // 5️⃣ Subtotal (after discount × quantity)
  const subtotal = productRows.reduce((sum, p) => {
    const quantity = quantityMap.get(String(p._id)) ?? 0;
    const unitPrice = p.discountPrice ?? p.price;
    return sum + unitPrice * quantity;
  }, 0);

  // 6️⃣ Tax (5% once)
  const tax = (subtotal * 5) / 100;

  // 7️⃣ Final total
  const total = subtotal + tax;

  console.log("TOTAL PRICING IS: ", total);
  return total;
};
