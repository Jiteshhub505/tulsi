import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const mongoUri: string = uri;

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
  if (!global._mongooseConnPromise) {
    global._mongooseConnPromise = mongoose.connect(mongoUri);
  }
  return global._mongooseConnPromise;
}
