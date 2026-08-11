import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnPromise: Promise<typeof mongoose> | undefined;
}

/**
 * Connects Mongoose to MongoDB, reusing the connection across hot reloads
 * and across serverless invocations. Call this at the top of every route
 * handler / server function before using any model, e.g.:
 *
 *   import connectDB from "@/db/mongoose";
 *   await connectDB();
 */
export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!global._mongooseConnPromise) {
    global._mongooseConnPromise = mongoose.connect(uri);
  }
  return global._mongooseConnPromise;
}
