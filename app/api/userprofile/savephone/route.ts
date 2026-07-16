import connectDB from "@/db/mongoose";
import { User } from "@/db/models";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  await connectDB();
  const { phone, id } = await req.json();
  const userId = id;

  if (!userId || !phone)
    return Response.json({ message: "send correct details" }, { status: 500 });

  try {
    await User.findByIdAndUpdate(userId, { phone });

    return NextResponse.json({
      message: "Phone number updated!",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error updating",
      success: true,
    });
  }
}
