import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";

export const PUT = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  await connectDB();

  const {
    name,
    title,
    category,
    description,
    price,
    discountPrice,
    inStock,
    galleryImages,
    form,
    goal,
    ingredients,
    allergens,
    warnings,
    directions,
    certifications,
    expiryDate,
    manufacturedDate,
    createdAt,
    isBestSeller,
  } = await req.json();
  const newExpiryDate = expiryDate ? new Date(expiryDate) : undefined;
  const newManufacturedDate = manufacturedDate ? new Date(manufacturedDate) : undefined;
  const { id } = await context.params;
  try {
    if (isBestSeller) {
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

    const updateFields: any = {
      name,
      title,
      category,
      description,
      price,
      discountPrice,
      inStock,
      galleryImages,
      form,
      goal,
      ingredients,
      allergens,
      warnings,
      directions,
      certifications,
      expiryDate: newExpiryDate,
      manufacturedDate: newManufacturedDate,
      createdAt,
    };

    if (isBestSeller !== undefined) {
      updateFields.isBestSeller = isBestSeller;
    }

    const update = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true },
    );
    return Response.json({
      update,
      product: update,
      msg: "Succesfully updated",
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
