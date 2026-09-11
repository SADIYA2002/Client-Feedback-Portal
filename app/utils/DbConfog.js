import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URL) {
    console.warn("MongoDB warning: MONGO_URL is not configured.");
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URL, opts).then((m) => {
      console.log("MongoDB connected successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
};