import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Ticket } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  await connectDB();
  const { input } = await req.json();
  const session = await getServerSession(authOptions);

  //@ts-ignore
  const userId = session?.user.id || GUEST_USER_ID;
  try {
    const response = await Ticket.create({
      subject: input,
      userId,
    });
    return Response.json(
      { success: true, ticketId: response.id },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
