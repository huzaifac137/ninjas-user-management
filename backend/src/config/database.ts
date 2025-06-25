import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const dbConnection = async () => {
  if (!process.env.MONGO_PUBLIC_URL) {
    throw new Error('MONGO_URL environment variable is not set');
  }
  mongoose
    .connect(process.env.MONGO_PUBLIC_URL)
    .then(() => {
      console.log("Database Connection established");
    })
    .catch(err => {
      console.log("Error connecting to Database: "+err);
      process.exit(1);
    });
};