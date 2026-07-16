import connectDB from "@/db/mongoose";
import { Address, Cart, Chat, Ticket, User } from "@/db/models";

export const DELETE = async (req: Request) => {
  await connectDB();

  const { userId } = await req.json();
  try {
    // 1️⃣ delete chats linked to user's tickets
    const userTickets = await Ticket.find({ userId });
    const ticketIds = userTickets.map((t: any) => t.id);

    if (ticketIds.length) {
      await Chat.deleteMany({ ticketId: { $in: ticketIds } });
    }

    // 2️⃣ delete tickets
    await Ticket.deleteMany({ userId });

    // 3️⃣ other direct children
    await Cart.deleteMany({ userId });
    await Address.deleteMany({ userId });

    // 4️⃣ finally delete user
    await User.findByIdAndDelete(userId);

    return Response.json({ message: "Successfully deleted", success: true });
  } catch (error) {
    return Response.json({
      message: "failed to delete",
      success: false,
      error,
    });
  }
};
