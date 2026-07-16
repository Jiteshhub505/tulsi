import connectDB from "@/db/mongoose";
import { Chat } from "@/db/models";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const GET = async (req: Request) => {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    //@ts-ignore
    const role = session?.user.role;
    if (!userEmail) {
      return Response.json(
        { success: false, msg: "Unauthenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return Response.json(
        { success: false, msg: "ticketId missing" },
        { status: 400 }
      );
    }

    const response =
      role == "admin"
        ? await Chat.find({ ticketId })
        : await Chat.find({ userEmail, ticketId });

    return Response.json({
      success: true,
      chats: response,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
