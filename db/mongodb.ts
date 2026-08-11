import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Reuse the connection across HMR reloads in dev.
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // Safe fallback during build time when MONGODB_URI is not set
  clientPromise = Promise.reject(
    new Error("Missing MONGODB_URI environment variable")
  );
  clientPromise.catch(() => {});
}

// Used by @auth/mongodb-adapter (manages its own "users"/"accounts"/
// "sessions"/"verification_tokens" collections directly via the driver).
export default clientPromise;
