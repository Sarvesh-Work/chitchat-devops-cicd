import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { app, server } from "./app.js";
import dbConnection from "./utils/dbConnection.js";

dotenv.config({ path: "./.env" });

const startServer = async () => {
  try {
    await dbConnection();
    console.log("Connected to MongoDB");

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Connection failed with MongoDB:", error);
    process.exit(1);
  }
};

// Basic route
app.get("/", (req, res) => {
  res.send("hello");
});
// Basic route

startServer();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
