import connectDB from "@/db/mongoose";
import { Ticket } from "@/db/models";

export const PUT = async (req: Request) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const id = searchParams.get("ticketId");
  console.log("details are: ", status, id);
  if (
    !status ||
    !id ||
    !["open", "completed", "pending", "replied"].includes(status)
  )
    return Response.json({
      status: 500,
      message: "Please provide ID & Status",
    });
  try {
    await Ticket.findByIdAndUpdate(id, { status });

    return Response.json({
      status: 200,
      message: "Successfully updated category",
    });
  } catch (error) {
    return Response.json({ message: "Error updating categories", error });
  }
};
