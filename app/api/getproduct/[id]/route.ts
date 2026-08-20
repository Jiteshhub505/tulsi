import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const cacheHeaders = {
    "Cache-Control": "no-store, max-age=0, must-revalidate",
  };

  try {
    const product = await Product.findById(id).lean();
    return NextResponse.json({ product, success: true }, { headers: cacheHeaders });
  } catch (error) {
    console.log("error getting products....", error);
    return NextResponse.json({ error, success: false });
  }
}
