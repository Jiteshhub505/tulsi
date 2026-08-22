import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cacheHeaders = {
    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  };

  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    return NextResponse.json({ product, success: true }, { headers: cacheHeaders });
  } catch (error) {
    console.log("error getting products....", error);
    return NextResponse.json({ error, success: false });
  }
}
