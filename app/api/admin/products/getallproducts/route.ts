import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";

export const GET = async () => {
  await connectDB();

  try {
    const response = await Product.find({});
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
