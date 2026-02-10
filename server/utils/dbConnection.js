import mongoose from "mongoose";
import { DB_Name } from "../constants/index.js";

const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

export default dbConnection;
