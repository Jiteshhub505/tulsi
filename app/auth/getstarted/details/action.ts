"use server";

import connectDB from "@/db/mongoose";
import { User } from "@/db/models";

export async function updateUserName(email: string, name: string) {
  await connectDB();
  try {
    await User.updateOne({ email }, { name });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error updating name",
    };
  }
}
