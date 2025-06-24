import { MongoClient, GridFSBucket } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://lms:lms123@cluster0.ifwloeb.mongodb.net";
let bucket;

const connectDB = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("yourDB"); // Update with your DB name
  bucket = new GridFSBucket(db, { bucketName: "assets" });
  console.log("✅ MongoDB connected and GridFS ready");
};

export { connectDB as default, bucket };
