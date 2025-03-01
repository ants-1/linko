import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
