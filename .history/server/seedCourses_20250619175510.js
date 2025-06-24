import { MongoClient } from "mongodb";
import {
  dummyCourses,
  dummyStudentEnrolled,
  dummyTestimonial,
} from "./asset/"; // make sure the path is correct and ends in `.js`

const uri = "mongodb+srv://lms:lms123@cluster0.ifwloeb.mongodb.net";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db("yourDB"); // Replace with your actual DB name

    // Optional: clear old data
    // await db.collection("courses").deleteMany({});
    // await db.collection("enrollments").deleteMany({});
    // await db.collection("testimonials").deleteMany({});

    // Insert data
    if (dummyCourses?.length) {
      await db.collection("courses").insertMany(dummyCourses);
    }

    if (dummyStudentEnrolled?.length) {
      await db.collection("enrollments").insertMany(dummyStudentEnrolled);
    }

    if (dummyTestimonial?.length) {
      await db.collection("testimonials").insertMany(dummyTestimonial);
    }

    console.log("✅ All data seeded successfully.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();
