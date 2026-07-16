import connectDB from "@/db/mongoose";
import { Address } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const token = await getToken({ req });

  const id = token?.sub || GUEST_USER_ID;
  try {
    await Address.create({
      userId: id,
      phoneNumber: data.phone,
      houseNumber: data.house,
      area: data.road,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      nearby: data.nearby,
    });
    return NextResponse.json({
      message: "Successfully added address",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error adding address",
      error,
      success: false,
    });
  }
}
