export const dynamic = "force-dynamic";

import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await context.params;
  const { data } = await req.json();
  const url = data.url;
  try {
    await Product.findByIdAndUpdate(id, { $pull: { galleryImages: url } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error, success: false });
  }
}
