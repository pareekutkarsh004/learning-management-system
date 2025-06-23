import { MongoClient } from "mongodb";
import {
  dummyCourses,
  dummyEducatorData,
  dummyStudentEnrolled,
} from "./asset/asset.js"; // ensure this path is correct and uses .js

const uri = "mongodb+srv://lms:lms123@cluster0.ifwloeb.mongodb.net";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db("yourDB"); // replace with your actual DB name if needed

    // Optional: clean previous data
    // await db.collection("educators").deleteMany({});
    // await db.collection("courses").deleteMany({});
    // await db.collection("enrollments").deleteMany({});

    // Insert educator
    await db.collection("educators").insertOne(dummyEducatorData);

    // Insert courses
    await db.collection("courses").insertMany(dummyCourses);

    // Insert enrollments
    await db.collection("enrollments").insertMany(dummyStudentEnrolled);

    console.log("✅ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();
