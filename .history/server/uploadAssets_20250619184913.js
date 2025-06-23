// uploadAssets.js

import fs from "fs";
import path from "path";
import { MongoClient, GridFSBucket } from "mongodb";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ✅ Replace with your actual Atlas URI and password
const uri =
  "mongodb+srv://llm615819:<your_real_password>@cluster0.731u1du.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Folder path relative to this script
const folderPath = path.join(__dirname, "assets");

// ✅ Set your actual DB name here
const DB_NAME = "edemy"; // or "lms" or whatever you're using

async function uploadAssetsFolder() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const bucket = new GridFSBucket(db, { bucketName: "assets" });

    const files = fs.readdirSync(folderPath).filter((f) => !f.startsWith("."));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const readStream = fs.createReadStream(filePath);
      const uploadStream = bucket.openUploadStream(file);

      await new Promise((resolve, reject) => {
        readStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
      });

      console.log(`✅ Uploaded: ${file}`);
    }

    console.log("🎉 All files uploaded to MongoDB Atlas GridFS!");
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
  } finally {
    await client.close();
  }
}

uploadAssetsFolder();
