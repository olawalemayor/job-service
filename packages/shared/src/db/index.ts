import mongoose from "mongoose";

export async function connectToDb(url: string): Promise<void> {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}
