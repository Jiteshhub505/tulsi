import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnPromise: Promise<typeof mongoose> | undefined;
}

/**
 * Connects Mongoose to MongoDB with optimized connection pooling
 * and serverless lifecycle reuse.
 */
export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!global._mongooseConnPromise) {
    global._mongooseConnPromise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      })
      .catch((err) => {
        global._mongooseConnPromise = undefined;
        throw err;
      });
  }
  return global._mongooseConnPromise;
}
