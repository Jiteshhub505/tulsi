import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";

export async function GET() {
  await connectDB();

  const totalOrders = await Order.countDocuments({});
  const cancelledOrders = await Order.countDocuments({
    $or: [
      { order_status: { $in: ["cancelled", "CANCELED", "Cancelled"] } },
      { "shiprocket.status": { $in: ["CANCELLED", "CANCELED", "cancelled"] } },
    ],
  });
  const failedPayments = await Order.countDocuments({
    order_status: { $in: ["failed", "FAILED", "Failed"] },
  });
  const createdOrders = await Order.countDocuments({
    order_status: { $in: ["created", "pending", "CREATED", "PENDING"] },
  });

  const paidOrders = await Order.find({
    order_status: { $in: ["paid", "completed", "delivered", "PAID", "COMPLETED", "DELIVERED"] },
  }).select("amount createdAt");

  const totalAmount = paidOrders.reduce(
    (sum: number, order: any) => sum + (order.amount || 0),
    0
  );

  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const recentPaidOrders = await Order.find({
    order_status: { $in: ["paid", "completed", "delivered", "PAID", "COMPLETED", "DELIVERED"] },
    createdAt: { $gte: threeMonthsAgo },
  }).select("amount createdAt");

  const monthlyRevenueMap = new Map<string, number>();
  for (const order of recentPaidOrders) {
    const o = order as any;
    const month = new Date(o.createdAt).toISOString().slice(0, 7);
    monthlyRevenueMap.set(
      month,
      (monthlyRevenueMap.get(month) || 0) + (o.amount || 0)
    );
  }
  const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => (a.month < b.month ? 1 : -1));

  return Response.json({
    success: true,
    stats: {
      totalOrders: totalOrders || 0,
      paidOrdersCount: paidOrders.length || 0,
      cancelledOrders: cancelledOrders || 0,
      failedPayments: failedPayments || 0,
      createdOrders: createdOrders || 0,
      totalAmount: totalAmount || 0,
      monthlyRevenue: monthlyRevenue,
    },
  });
}
