import mongoose from "mongoose";

export const connectMongoDB = async (connectionURL) => {
  try {
    const connection = await mongoose.connect(connectionURL)
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

