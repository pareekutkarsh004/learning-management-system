// controllers/courseController.js
import Course from "../models/Course.js";
import User from "../models/User.model.js";

// GET: All published courses (for course listings)
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" })
      .lean();

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("❌ Error in getAllCourse:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Full course details by ID
export const getCourseByid = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`🔍 Fetching course by ID: ${id}`);

    const courseData = await Course.findById(id).populate({ path: "educator" });

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Secure lecture URLs unless previewable
    courseData.courseContent?.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        if (!lecture?.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    console.log(`✅ Course "${courseData.courseTitle}" fetched.`);

    // ✅ Fix: return the course data under key `course`
    res.status(200).json({ success: true, course: courseData });
  } catch (error) {
    console.error("❌ Error in getCourseByid:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
