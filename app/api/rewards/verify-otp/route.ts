import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { CoinWallet, User } from "@/db/models";
import { verifyTwoFactorOtp } from "@/lib/sms/twoFactor";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { phone, sessionId, otp, userId } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // 1. Verify OTP with 2factor.in
    const verifyResult = await verifyTwoFactorOtp(sessionId, otp, cleanPhone);
    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, message: verifyResult.message || "Invalid OTP" },
        { status: 400 }
      );
    }

    // 2. Find or Create Coin Wallet
    let wallet = await CoinWallet.findOne({ phone: cleanPhone });

    if (!wallet) {
      wallet = await CoinWallet.create({
        phone: cleanPhone,
        userId: userId || null,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        isPhoneVerified: true,
        hasSpunWheel: false,
        spinWonAmount: 0,
        history: [],
      });
    } else {
      wallet.isPhoneVerified = true;
      await wallet.save();
    }

    // Link user phone if userId provided
    if (userId) {
      await User.findByIdAndUpdate(userId, { phone: cleanPhone });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Mobile verified successfully!",
      wallet: {
        phone: wallet.phone,
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent,
        isPhoneVerified: wallet.isPhoneVerified,
        hasSpunWheel: wallet.hasSpunWheel || false,
        spinWonAmount: wallet.spinWonAmount || 0,
      },
      hasSpunWheel: wallet.hasSpunWheel || false,
    });
  } catch (error: any) {
    console.error("VERIFY_OTP_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
