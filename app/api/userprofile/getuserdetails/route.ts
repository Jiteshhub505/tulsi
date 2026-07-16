import connectDB from "@/db/mongoose";
import { User } from "@/db/models";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = await getToken({ req });
  const userId = token?.sub || GUEST_USER_ID;

  // Ensure guest user exists
  const guestUser = await User.findById(GUEST_USER_ID);
  if (!guestUser) {
    await User.create({
      _id: GUEST_USER_ID,
      name: "Guest User",
      email: GUEST_USER_EMAIL,
      role: "user",
    });
  }

  try {
    const user = await User.find({ _id: userId });
    return NextResponse.json({ message: "Fetched details", user });
  } catch (error) {
    return NextResponse.json({
      error,
      message: "Internal server error",
      success: false,
    });
  }
}
