/**
 * One-off CLI helper to promote a user to the "admin" role.
 *
 * Usage:
 *   node --env-file=.env scripts/make-admin.ts someone@example.com
 *
 * (or, via the package.json script)
 *   npm run make-admin -- someone@example.com
 *
 * Requirements:
 *   - The user must already exist in the "users" collection (i.e. they've
 *     signed in at least once via /auth/getstarted).
 *   - MONGODB_URI must be set (loaded from .env via --env-file, or already
 *     present in the environment).
 *   - After running this, the user must log out and log back in, since the
 *     role is only read into the JWT on login (see the `jwt` callback in
 *     app/api/auth/[...nextauth]/route.ts).
 */

import mongoose from "mongoose";
import { User } from "../db/models/index.ts";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: node --env-file=.env scripts/make-admin.ts <email>");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set. Pass it via `node --env-file=.env scripts/make-admin.ts <email>` " +
        "or export it in your shell first.",
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const existing = await User.findOne({ email });

    if (!existing) {
      console.error(
        `No user found with email "${email}". They need to sign in at least once first.`,
      );
      process.exit(1);
    }

    if (existing.role === "admin") {
      console.log(`"${email}" is already an admin. Nothing to do.`);
      return;
    }

    existing.role = "admin";
    await existing.save();

    console.log(`✅ "${email}" is now an admin.`);
    console.log("They must log out and log back in for the change to take effect.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error("Failed to promote user:", err);
  process.exit(1);
});
