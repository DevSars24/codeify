import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MONGODB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MONGODB connection...");
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("MONGODB connected successfully");
      return mongoose;
    }).catch(err => {
      console.error("MONGODB connection error:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
