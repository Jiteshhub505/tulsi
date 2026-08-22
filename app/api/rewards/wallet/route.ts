import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { CoinWallet } from "@/db/models";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    const wallet = await CoinWallet.findOne({ phone: cleanPhone }).lean();

    if (!wallet) {
      return NextResponse.json({
        success: true,
        found: false,
        wallet: {
          phone: cleanPhone,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
          isPhoneVerified: false,
          history: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      wallet: {
        phone: (wallet as any).phone,
        balance: (wallet as any).balance || 0,
        totalEarned: (wallet as any).totalEarned || 0,
        totalSpent: (wallet as any).totalSpent || 0,
        isPhoneVerified: (wallet as any).isPhoneVerified || false,
        hasSpunWheel: (wallet as any).hasSpunWheel || false,
        spinWonAmount: (wallet as any).spinWonAmount || 0,
        history: (wallet as any).history || [],
      },
    });
  } catch (error: any) {
    console.error("GET_WALLET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}
