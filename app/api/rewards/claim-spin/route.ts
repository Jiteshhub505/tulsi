import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { CoinWallet } from "@/db/models";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { phone, amount = 100 } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const wallet = await CoinWallet.findOne({ phone: cleanPhone });

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Please verify your mobile number first" },
        { status: 400 }
      );
    }

    if (!wallet.isPhoneVerified) {
      return NextResponse.json(
        { success: false, message: "Mobile number is not verified yet" },
        { status: 400 }
      );
    }

    // STRICT CHECK: Spin wheel can only be used 1 TIME per number
    if (wallet.hasSpunWheel) {
      return NextResponse.json(
        {
          success: false,
          alreadySpun: true,
          message: "You have already spun the wheel for this mobile number!",
          wallet: {
            phone: wallet.phone,
            balance: wallet.balance,
            totalEarned: wallet.totalEarned,
            totalSpent: wallet.totalSpent,
            hasSpunWheel: true,
          },
        },
        { status: 400 }
      );
    }

    const winAmount = Number(amount) || 100;
    wallet.hasSpunWheel = true;
    wallet.spinWonAmount = winAmount;
    wallet.balance += winAmount;
    wallet.totalEarned += winAmount;
    wallet.history.push({
      type: "welcome",
      amount: winAmount,
      description: `🎁 Won ${winAmount} Tulsi Coins in Spin and Win`,
      date: new Date(),
    });

    await wallet.save();

    return NextResponse.json({
      success: true,
      message: `🎉 ${winAmount} Tulsi Coins added to your wallet!`,
      wallet: {
        phone: wallet.phone,
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent,
        hasSpunWheel: true,
      },
    });
  } catch (error: any) {
    console.error("CLAIM_SPIN_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to claim spin reward" },
      { status: 500 }
    );
  }
}
