const { MongoClient } = require("mongodb");
const {
  dummyCourses,
  dummyEducatorData,
  dummyStudentEnrolled,
} = require("./asset/"); // path to your modified assets.js

const uri = "mongodb+srv://<username>:<password>@cluster.mongodb.net/yourDB";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db("yourDB");

    // Insert educator
    await db.collection("educators").insertOne(dummyEducatorData);

    // Insert courses
    await db.collection("courses").insertMany(dummyCourses);

    // Insert enrollments
    await db.collection("enrollments").insertMany(dummyStudentEnrolled);

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();
