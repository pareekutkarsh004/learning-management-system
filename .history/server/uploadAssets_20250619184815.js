import fs from "fs";
import path from "path";
import { MongoClient, GridFSBucket } from "mongodb";
import { fileURLToPath } from "url";
import { dirname } from "path";

const uri =
  "mongodb+srv://llm615819:<db_password>@cluster0.731u1du.mongodb.net/";
const client = new MongoClient(uri);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folderPath = path.join(__dirname, "assets");

async function uploadAssetsFolder() {
  try {
    await client.connect();
    const db = client.db("yourDB"); // replace with actual DB name

    const bucket = new GridFSBucket(db, { bucketName: "assets" });

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const readStream = fs.createReadStream(filePath);
      const uploadStream = bucket.openUploadStream(file);
      await new Promise((resolve, reject) => {
        readStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
      });

      console.log(`✅ Uploaded: ${file}`);
    }

    console.log("🎉 All files uploaded to MongoDB GridFS!");
  } catch (err) {
    console.error("❌ Error uploading files:", err);
  } finally {
    await client.close();
  }
}

uploadAssetsFolder();
