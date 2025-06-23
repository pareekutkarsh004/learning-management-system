import mongoose from "mongoose";
import Course from "./models/Course.js"; // adjust the path to your Course model

const MONGO_URI =
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";

const courseData = {
  _id: "605c72efb3f1c2b1f8e4e1a1",
  courseTitle: "Introduction to JavaScript",
  courseDescription:
    "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web...</p>",
  coursePrice: 49.99,
  isPublished: true,
  discount: 20,
  courseThumbnail: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg",
  courseContent: [
    {
      chapterId: "chapter1",
      chapterOrder: 1,
      chapterTitle: "Getting Started with JavaScript",
      chapterContent: [
        {
          lectureId: "lecture1",
          lectureTitle: "What is JavaScript?",
          lectureDuration: 16,
          lectureUrl: "https://youtu.be/CBWnBi-awSA",
          isPreviewFree: true,
          lectureOrder: 1,
        },
        {
          lectureId: "lecture2",
          lectureTitle: "Setting Up Your Environment",
          lectureDuration: 19,
          lectureUrl: "https://youtu.be/4l87c2aeB4I",
          isPreviewFree: false,
          lectureOrder: 2,
        },
      ],
    },
    {
      chapterId: "chapter2",
      chapterOrder: 2,
      chapterTitle: "Variables and Data Types",
      chapterContent: [
        {
          lectureId: "lecture3",
          lectureTitle: "Understanding Variables",
          lectureDuration: 20,
          lectureUrl: "https://youtu.be/pZQeBJsGoDQ",
          isPreviewFree: true,
          lectureOrder: 1,
        },
        {
          lectureId: "lecture4",
          lectureTitle: "Data Types in JavaScript",
          lectureDuration: 10,
          lectureUrl: "https://youtu.be/ufHT2WEkkC4",
          isPreviewFree: false,
          lectureOrder: 2,
        },
      ],
    },
  ],
  educator: "675ac1512100b91a6d9b8b24",
  enrolledStudents: [
    "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
    "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
  ],
  courseRatings: [
    {
      userId: "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
      rating: 5,
    },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Course.create(courseData);
    console.log("✅ Course inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting course:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
