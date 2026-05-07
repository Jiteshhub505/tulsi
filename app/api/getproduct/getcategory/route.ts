import db from "@/db/db";
import schema from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await db
      .selectDistinct({ category: schema.products.category })
      .from(schema.products);

    const categories = rows.map((row) => row.category);

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error getting product categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
