import connectDB from "@/db/mongoose";
import { Ticket } from "@/db/models";

export const GET = async (req: Request) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const validStatuses = ["pending", "open", "completed", "replied"] as const;
    if (!validStatuses.includes(status as any)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await Ticket.find({ status })
      .sort({ createdAt: 1 })
      .limit(10)
      .skip(0);

    return Response.json({
      result,
      message: "Successfully fetched",
      success: true,
    });
  } catch (error) {
    return Response.json({
      error,
      message: "Couldn't get tickets",
      success: false,
    });
  }
};
