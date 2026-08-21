import { NextResponse } from "next/server";

export const dynamic = "force-static";

const ALLOWED_CATEGORIES = [
  "Digestion",
  "Health & Fitness",
  "Stamina and Power",
  "Health Disease",
];

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      categories: ALLOWED_CATEGORIES,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
