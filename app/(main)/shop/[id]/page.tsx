import SingleProduct from "@/components/shopping/SingleProduct";
import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";

export const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let initialProduct = null;
  try {
    await connectDB();
    const doc: any = await Product.findById(id).lean();
    if (doc) {
      initialProduct = {
        ...doc,
        _id: doc._id?.toString() || id,
        id: doc._id?.toString() || id,
      };
    }
  } catch (error) {
    // If DB error or fallback ID, client will fetch fallback smoothly
  }

  return (
    <div>
      <SingleProduct id={id} initialProduct={initialProduct} />
    </div>
  );
};

export default page;
