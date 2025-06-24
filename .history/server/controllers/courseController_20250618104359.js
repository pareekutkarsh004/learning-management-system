import Course from "../models/Course.js";
import User from "../models/User.model.js";

// Get all courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(['-courseContent', '-enrolledStudents'])
      .populate({ path: 'educator' });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get course by ID
export const getCourseByid = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: 'educator' });

    if (!courseData) {
      return res.json({ success: false, message: "Course not found" });
    }

    // Remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
