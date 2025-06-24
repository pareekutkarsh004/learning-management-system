import Course from "../models/Course.js";
import User from "../models/User.model.js";

// GET: All published courses (for listings)
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

// GET: Full course detail by ID
export const getCourseByid = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Remove non-preview lecture URLs for security
    if (Array.isArray(courseData.courseContent)) {
      courseData.courseContent.forEach((chapter) => {
        chapter.chapterContent?.forEach((lecture) => {
          if (!lecture.isPreviewFree) {
            lecture.lectureUrl = "";
          }
        });
      });
    }

    res.status(200).json({ success: true, courseData });
  } catch (error) {
    console.error("❌ Error in getCourseByid:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
