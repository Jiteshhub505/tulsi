import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const cacheHeaders = {
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  };

  try {
    const product = await Product.findById(id).lean();
    return NextResponse.json({ product, success: true }, { headers: cacheHeaders });
  } catch (error) {
    console.log("error getting products....", error);
    return NextResponse.json({ error, success: false });
  }
}
