import mongoose from "mongoose";
import "dotenv/config";
import Course from "./models/Course.js";
import { dummyCourses } from ""; // ✅ import dummyCourses

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Insert Dummy Data
const importData = async () => {
  try {
    await connectDB();

    await Course.deleteMany(); // Optional: clears existing courses
    await Course.insertMany(dummyCourses);

    console.log("Dummy courses inserted!");
    process.exit();
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    process.exit(1);
  }
};

importData();
