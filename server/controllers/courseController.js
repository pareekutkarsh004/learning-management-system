// controllers/courseController.js
import Course from "../models/Course.js";
import User from "../models/User.model.js";

// GET: All published courses (for course listings)
export const getAllCourse = async (req, res) => {
  try {
    console.log("🔍 Fetching all published courses...");

    // Fetch published courses with error handling
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .lean();

    if (!courses || courses.length === 0) {
      console.log("📝 No published courses found");
      return res.status(200).json({
        success: true,
        courses: [],
        message: "No published courses found",
      });
    }

    console.log(`📚 Found ${courses.length} published courses`);

    // Manually populate educator data
    const coursesWithEducator = await Promise.all(
      courses.map(async (course) => {
        try {
          // Handle both ObjectId and string formats for educator field
          let educator = null;

          if (course.educator) {
            // Try finding by clerkId first (string format)
            educator = await User.findOne({
              clerkId: course.educator,
            }).lean();

            // If not found and educator looks like ObjectId, try finding by _id
            if (!educator && course.educator.match(/^[0-9a-fA-F]{24}$/)) {
              educator = await User.findById(course.educator).lean();
            }
          }

          return {
            ...course,
            educator: educator || {
              _id: null,
              firstName: "Unknown",
              lastName: "Educator",
              email: "unknown@example.com",
            },
          };
        } catch (error) {
          console.error(
            `❌ Error fetching educator for course ${course._id}:`,
            error.message
          );
          return {
            ...course,
            educator: {
              _id: null,
              firstName: "Unknown",
              lastName: "Educator",
              email: "unknown@example.com",
            },
          };
        }
      })
    );

    console.log("✅ Successfully populated educator data");

    res.status(200).json({
      success: true,
      courses: coursesWithEducator,
      total: coursesWithEducator.length,
    });
  } catch (error) {
    console.error("❌ Error in getAllCourse:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// GET: Full course details by ID
export const getCourseByid = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`🔍 Fetching course by ID: ${id}`);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Fetch course data
    const courseData = await Course.findById(id).lean();

    if (!courseData) {
      console.log(`❌ Course with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log(`📚 Found course: "${courseData.courseTitle}"`);

    // Manually populate educator data with better error handling
    try {
      let educator = null;

      if (courseData.educator) {
        // Try finding by clerkId first (string format)
        educator = await User.findOne({
          clerkId: courseData.educator,
        }).lean();

        // If not found and educator looks like ObjectId, try finding by _id
        if (!educator && courseData.educator.match(/^[0-9a-fA-F]{24}$/)) {
          educator = await User.findById(courseData.educator).lean();
        }
      }

      courseData.educator = educator || {
        _id: null,
        firstName: "Unknown",
        lastName: "Educator",
        email: "unknown@example.com",
      };
    } catch (error) {
      console.error(
        `❌ Error fetching educator for course ${id}:`,
        error.message
      );
      courseData.educator = {
        _id: null,
        firstName: "Unknown",
        lastName: "Educator",
        email: "unknown@example.com",
      };
    }

    // Secure lecture URLs unless previewable
    if (courseData.courseContent && Array.isArray(courseData.courseContent)) {
      courseData.courseContent.forEach((chapter) => {
        if (chapter?.chapterContent && Array.isArray(chapter.chapterContent)) {
          chapter.chapterContent.forEach((lecture) => {
            if (lecture && !lecture.isPreviewFree) {
              lecture.lectureUrl = "";
            }
          });
        }
      });
    }

    console.log(`✅ Course "${courseData.courseTitle}" fetched successfully`);

    res.status(200).json({
      success: true,
      course: courseData,
    });
  } catch (error) {
    console.error("❌ Error in getCourseByid:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Additional helper function to check database connection
export const checkDatabaseConnection = async (req, res) => {
  try {
    // Simple database connectivity check
    const courseCount = await Course.countDocuments();
    const userCount = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: "Database connection successful",
      stats: {
        totalCourses: courseCount,
        totalUsers: userCount,
      },
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
