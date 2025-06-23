// controllers/courseController.js
import Course from "../models/Course.js";
import User from "../models/User.model.js";

// GET: All published courses (for course listings)
export const getAllCourse = async (req, res) => {
  try {
    // Fix 1: Remove populate since educator field contains string IDs, not ObjectIds
    // Fix 2: Add proper error handling for the query
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .lean();

    // Fix 3: Manually populate educator data if needed
    const coursesWithEducator = await Promise.all(
      courses.map(async (course) => {
        try {
          // Since educator field stores clerkId (string), find user by clerkId
          const educator = await User.findOne({
            clerkId: course.educator,
          }).lean();
          return {
            ...course,
            educator: educator || null,
          };
        } catch (error) {
          console.error(
            `❌ Error fetching educator for course ${course._id}:`,
            error
          );
          return {
            ...course,
            educator: null,
          };
        }
      })
    );

    res.status(200).json({ success: true, courses: coursesWithEducator });
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

    // Fix 4: Remove populate since educator field contains string IDs, not ObjectIds
    const courseData = await Course.findById(id).lean();

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Fix 5: Manually populate educator data
    try {
      const educator = await User.findOne({
        clerkId: courseData.educator,
      }).lean();
      courseData.educator = educator || null;
    } catch (error) {
      console.error(`❌ Error fetching educator for course ${id}:`, error);
      courseData.educator = null;
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

    res.status(200).json({ success: true, course: courseData });
  } catch (error) {
    console.error("❌ Error in getCourseByid:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
