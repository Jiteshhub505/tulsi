import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { CoinWallet, Order } from "@/db/models";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    const filter: any = {};
    if (query) {
      filter.phone = { $regex: query, $options: "i" };
    }

    const wallets = await CoinWallet.find(filter)
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    // Fetch order statistics per phone number
    const phones = wallets.map((w: any) => w.phone);
    const orders = await Order.find({
      "shippingDetails.phone": {
        $in: phones.map((p: string) => new RegExp(p.slice(-10) + "$")),
      },
    }).lean();

    const ordersByPhone = new Map<string, { count: number; totalSpent: number }>();
    orders.forEach((o: any) => {
      const rawPhone = o.shippingDetails?.phone || "";
      const clean = rawPhone.replace(/\D/g, "").slice(-10);
      if (clean) {
        const existing = ordersByPhone.get(clean) || { count: 0, totalSpent: 0 };
        existing.count += 1;
        existing.totalSpent += o.amount || 0;
        ordersByPhone.set(clean, existing);
      }
    });

    const numbersData = wallets.map((w: any) => {
      const orderStats = ordersByPhone.get(w.phone) || { count: 0, totalSpent: 0 };
      return {
        _id: w._id,
        phone: w.phone,
        userId: w.userId,
        balance: w.balance || 0,
        totalEarned: w.totalEarned || 0,
        totalSpent: w.totalSpent || 0,
        isPhoneVerified: w.isPhoneVerified || false,
        hasSpunWheel: w.hasSpunWheel || false,
        spinWonAmount: w.spinWonAmount || 0,
        ordersCount: orderStats.count,
        ordersSpent: orderStats.totalSpent,
        history: w.history || [],
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      };
    });

    const stats = {
      totalNumbers: wallets.length,
      verifiedNumbers: wallets.filter((w: any) => w.isPhoneVerified).length,
      spunNumbers: wallets.filter((w: any) => w.hasSpunWheel).length,
      totalCoinsInCirculation: wallets.reduce((sum: number, w: any) => sum + (w.balance || 0), 0),
      totalCoinsDistributed: wallets.reduce((sum: number, w: any) => sum + (w.totalEarned || 0), 0),
    };

    return NextResponse.json({
      success: true,
      numbers: numbersData,
      stats,
    });
  } catch (error: any) {
    console.error("ADMIN_GET_NUMBERS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch numbers" },
      { status: 500 }
    );
  }
}
