import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

export async function getCartUserId(): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    //@ts-ignore
    if (session?.user?.id) {
      //@ts-ignore
      return session.user.id;
    }
  } catch (err) {
    // If session error, fallback to guest cookie
  }

  const cookieStore = await cookies();
  let guestId = cookieStore.get("tulsi_guest_id")?.value;
  if (!guestId) {
    guestId = `guest_${crypto.randomUUID()}`;
    cookieStore.set("tulsi_guest_id", guestId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  return guestId;
}
