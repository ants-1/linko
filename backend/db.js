import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to database");
  } catch {
    console.error("Failed to connect to the database, error: ", err);
  }
};

export default connectDB;