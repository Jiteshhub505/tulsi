import connectDB from "@/db/mongoose";
import { Chat } from "@/db/models";
import { getServerSession } from "next-auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession();
  try {
    const response = await Chat.find(
      { userEmail: session?.user?.email },
      "userEmail content createdAt",
    );

    const chats = response.map((c: any) => ({
      email: c.userEmail,
      content: c.content,
      createdAt: c.createdAt,
    }));

    return Response.json({
      success: true,
      chats,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
