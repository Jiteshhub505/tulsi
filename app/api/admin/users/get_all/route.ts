import connectDB from "@/db/mongoose";
import { User } from "@/db/models";

export const GET = async (req: Request) => {
  await connectDB();

  try {
    const response = await User.find({});
    return Response.json({
      users: response,
      success: true,
      message: "Successfuly fetched",
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      error,
      success: false,
      message: "error getting users",
    });
  }
};
