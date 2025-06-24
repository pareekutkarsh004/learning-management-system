import { MongoClient } from "mongodb";
import {
  dummyCourses,
  dummyStudentEnrolled,
  dummyTestimonial,
} from "./assets/sampleData.js";

const uri = "mongodb+srv://lms:lms123@cluster0.ifwloeb.mongodb.net";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db("yourDB");

    await db.collection("courses").insertMany(dummyCourses);
    await db.collection("enrollments").insertMany(dummyStudentEnrolled);
    await db.collection("testimonials").insertMany(dummyTestimonial);

    console.log("✅ Seeding completed.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();
