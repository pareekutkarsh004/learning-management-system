import mongoose from "mongoose";

// ✅ 1. Lecture Schema (embedded inside chapters)
const lectureSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true }, // in minutes
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ 2. Chapter Schema (embedded inside course)
const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true }, // ❗ Fix: typo from `chapterTite` to `chapterTitle`
    chapterContent: [lectureSchema],
  },
  { _id: false }
);

// ✅ 3. Course Schema
const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String }, // URL (can be GridFS or Cloudinary)
    coursePrice: { type: Number, required: true },

    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },

    courseContent: [chapterSchema],

    courseRatings: [
      {
        userId: { type: String }, // stringified Clerk user ID or Mongo ObjectId
        rating: { type: Number, min: 1, max: 5 },
      },
    ],

    educator: {
      type: String,
      ref: "User", // stringified user ID if not using ObjectId
      required: true,
    },

    enrolledStudents: [
      {
        type: String,
        ref: "User", // ❗ Fix: typo (removed extra space in `'User '`)
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

// ✅ 4. Export Course Model
const Course = mongoose.model("Course", courseSchema);
export default Course;
