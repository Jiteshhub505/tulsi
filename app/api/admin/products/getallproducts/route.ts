import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";

export const GET = async () => {
  await connectDB();

  try {
    // Only select fields needed by admin inventory/product list UI
    const response = await Product.find({})
      .select("name nameHi category price discountPrice inStock galleryImages isBestSeller medicineType createdAt")
      .lean();

    return Response.json(
      {
        response,
        message: "Successfully fetched products",
        status: 200,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    return Response.json({
      error,
      message: "Error fetching products",
      status: 500,
    });
  }
};
