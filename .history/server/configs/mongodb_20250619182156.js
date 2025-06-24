// server/configs/mongodb.js

import { MongoClient, GridFSBucket } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://lms:lms123@cluster0.ifwloeb.mongodb.net";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000, // Prevent timeout errors
});

let db;
let bucket;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("yourDB"); // 🔁 Use your actual DB name
    bucket = new GridFSBucket(db, { bucketName: "assets" });
    console.log("✅ MongoDB connected and GridFS ready");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit if connection fails
  }
};

export default connectDB;
export { db, bucket };
