import connectDB from "@/db/mongoose";
import { Address } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = await getToken({ req });

  const userId = token?.sub || GUEST_USER_ID;

  try {
    const response = await Address.find({ userId });

    return NextResponse.json({
      success: true,
      message: "Address fetched successfully",
      response,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching address" },
      { status: 500 }
    );
  }
}
