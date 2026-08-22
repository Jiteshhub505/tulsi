import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnPromise: Promise<typeof mongoose> | undefined;
  // eslint-disable-next-line no-var
  var _mongooseReadyState: boolean;
}

/**
 * Connects Mongoose to MongoDB with optimized connection pooling
 * and serverless lifecycle reuse.
 *
 * Cold-start mitigation:
 * - Global promise is reused across all API requests in the same serverless instance
 * - minPoolSize: 2 keeps at least 2 connections alive to avoid re-handshake on warm requests
 * - heartbeatFrequencyMS: 5000 sends lightweight pings every 5s to keep TCP alive
 * - serverSelectionTimeoutMS: 4000 fails fast rather than hanging user requests
 */
export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  // If already fully connected, skip immediately (hot path — 0ms)
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If a connection is already being established, wait for it (avoids duplicate connections)
  if (!global._mongooseConnPromise) {
    global._mongooseConnPromise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: 2,           // Keep 2 connections alive to avoid cold re-handshake
        serverSelectionTimeoutMS: 4000,
        socketTimeoutMS: 30000,
        heartbeatFrequencyMS: 5000, // Lightweight ping every 5s to keep connections alive
        connectTimeoutMS: 8000,
      })
      .catch((err) => {
        global._mongooseConnPromise = undefined;
        throw err;
      });
  }
  return global._mongooseConnPromise;
}
