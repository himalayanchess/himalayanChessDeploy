import mongoose from "mongoose";

export const dbconnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGO_URL!) {
    throw new Error("MONGO_URL! environment variable is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
