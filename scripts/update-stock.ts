import connectDB from "../db/mongoose";
import { Product } from "../db/models";

async function main() {
  await connectDB();
  const res = await Product.updateMany(
    {},
    { $set: { inStock: 50 } }
  );
  console.log(`Updated ${res.modifiedCount} products to inStock: 50`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
