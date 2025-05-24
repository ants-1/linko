import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL as string;

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to database.');
  } catch (err) {
    console.error(`Failed to connect to database, error: ${err}`);
  }
}

export default connectDatabase;