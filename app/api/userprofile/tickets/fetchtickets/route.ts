import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Ticket } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";
import { getServerSession } from "next-auth";

export const GET = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user.id || GUEST_USER_ID;
  try {
    const response = await Ticket.find({ userId });

    return Response.json({
      success: true,
      tickets: response,
      msg: "Succesfully fetched",
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
      msg: "Error fetching tickets",
    });
  }
};
