import mongoose from "mongoose";

// Mongoose connection
const MONGODB_URI = "mongodb+srv://llm615819:Vivek300705@cluster0.731u1du.mongodb.net/lms"; // replace `lms` with your DB name

// Define schemas (nested)
const lectureSchema = new mongoose.Schema({
  lectureId: String,
  lectureTitle: String,
  lectureDuration: Number,
  lectureUrl: String,
  isPreviewFree: Boolean,
  lectureOrder: Number,
}, { _id: false });

const chapterSchema = new mongoose.Schema({
  chapterId: String,
  chapterOrder: Number,
  chapterTitle: String,
  chapterContent: [lectureSchema],
}, { _id: false });

const courseSchema = new mongoose.Schema({
  courseTitle: String,
  courseDescription: String,
  coursePrice: Number,
  isPublished: Boolean,
  discount: Number,
  courseThumbnail: String,
  courseContent: [chapterSchema],
  educator: String,
  enrolledStudents: [String],
  courseRatings: [{ userId: String, rating: Number }],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);


const courseData = {
  courseTitle: "Introduction to JavaScript",
  courseDescription: `<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language...</p>`,
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

async function seedCourse() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const course = await Course.create(courseData);
    console.log("✅ Course seeded:", course._id);
  } catch (err) {
    console.error("❌ Error seeding course:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedCourse();
