import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    });
    console.log("✅ Mongoose connected to MongoDB");
  } catch (err) {
    console.error("❌ Mongoose connection failed:", err.message);
    process.exit(1);
  }
};

export default connectMongoose;
