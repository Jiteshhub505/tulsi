import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";

export const GET = async (req: Request) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 5;
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("statusFilter");
  const sort = searchParams.get("sort");
  const offset = (page - 1) * limit;

  try {
    const filter = status && status !== "ALL" ? { order_status: status } : {};
    const sortOption: Record<string, 1 | -1> = sort === "asc" ? { createdAt: 1 } : { createdAt: -1 };

    const recentOrders = await Order.find(filter).sort(sortOption).skip(offset).limit(limit).lean();
    const count = await Order.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);

    return Response.json({
      success: true,
      recentOrders,
      meta: { page, limit, totalRecords: count, totalPages },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Error fetching orders" }, { status: 500 });
  }
};
