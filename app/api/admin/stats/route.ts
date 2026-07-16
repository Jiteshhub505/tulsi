import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user?.id || GUEST_USER_ID;

  const totalOrders = await Order.countDocuments({ user_id: userId });
  const cancelledOrders = await Order.countDocuments({
    user_id: userId,
    order_status: "cancelled",
  });
  const createdOrders = await Order.countDocuments({
    user_id: userId,
    order_status: "created",
  });

  const paidOrders = await Order.find({
    user_id: userId,
    order_status: "paid",
  });
  const totalAmount = paidOrders.reduce(
    (sum: number, order: any) => sum + (order.amount || 0),
    0,
  );

  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const recentPaidOrders = await Order.find({
    user_id: userId,
    order_status: "paid",
    createdAt: { $gte: threeMonthsAgo },
  });

  const monthlyRevenueMap = new Map<string, number>();
  for (const order of recentPaidOrders) {
    const o = order as any;
    const month = new Date(o.createdAt).toISOString().slice(0, 7);
    monthlyRevenueMap.set(
      month,
      (monthlyRevenueMap.get(month) || 0) + (o.amount || 0),
    );
  }
  const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => (a.month < b.month ? 1 : -1));

  return Response.json({
    success: true,
    stats: {
      totalOrders: totalOrders || 0,
      cancelledOrders: cancelledOrders || 0,
      failedPayments: 0,
      createdOrders: createdOrders || 0,
      totalAmount: totalAmount || 0,
      monthlyRevenue: monthlyRevenue,
    },
  });
}
