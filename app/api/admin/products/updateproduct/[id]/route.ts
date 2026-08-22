import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";

export const PUT = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = await context.params;

    if (body.isBestSeller === true) {
      const currentCount = await Product.countDocuments({
        isBestSeller: true,
        _id: { $ne: id },
      });
      if (currentCount >= 4) {
        return Response.json({
          success: false,
          msg: "Limit reached. You can only have up to 4 Best Sellers. Please remove one first.",
          status: 400,
        });
      }
    }

    const updateFields: any = {};
    for (const key of Object.keys(body)) {
      if (key === "expiryDate") {
        updateFields.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
      } else if (key === "manufacturedDate") {
        updateFields.manufacturedDate = body.manufacturedDate ? new Date(body.manufacturedDate) : null;
      } else {
        updateFields[key] = body[key];
      }
    }

    const update = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return Response.json({
      update,
      product: update,
      msg: "Successfully updated",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      error,
      msg: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
