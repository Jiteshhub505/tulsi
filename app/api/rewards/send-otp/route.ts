import { NextResponse } from "next/server";
import { sendTwoFactorOtp } from "@/lib/sms/twoFactor";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid mobile number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const result = await sendTwoFactorOtp(cleanPhone);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error("SEND_OTP_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
