import { NextRequest, NextResponse } from "next/server";

// Auth verification has been disabled for now (local/dev mode).
// Previously this redirected unauthenticated/non-admin users away from
// /admin, /cart, /profile, and /details. Re-enable by restoring the
// token/role checks here once auth is wired back up.
export async function proxy(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/profile/:path*"],
};
