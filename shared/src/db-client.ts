import mongoose from "mongoose";
import { config } from "./config";

const connectToDb = async () => {
  try {
    await mongoose.connect(config.dbUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export { connectToDb };
