import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.model.js"; // ✅ Fixed import path
import { Purchase } from "../models/Purchase.js"; // ✅ Added missing import

// ✅ Update role of user to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Find user in MongoDB
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    // Check if user is already an educator
    if (user.role === "educator") {
      return res.status(400).json({
        success: false,
        message: "User is already an educator",
      });
    }

    // Update role in MongoDB
    user.role = "educator";
    await user.save();

    // Update role in Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({
      success: true,
      message: "You can publish your course now",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error in updateRoleToEducator:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add new Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "Course was Added" });
  } catch (error) {
    console.error("Error in addCourse:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Error in getEducatorCourses:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Educator Dashboard
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earning from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect Unique enrolled student IDs with their course Titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    console.error("Error in educatorDashboardData:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get enrolled students data
export const getEnrolledStudentsData = async (req, res) => {
  console.log("🎯 getEnrolledStudentsData called!"); // Add this
  console.log("User ID:", req.auth?.userId); // Add this

  try {
    const educator = req.auth.userId;
    console.log("Educator ID:", educator); // Add this

    const courses = await Course.find({ educator });
    console.log("Found courses:", courses.length); // Add this

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    console.log("Found purchases:", purchases.length); // Add this

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    console.log("Sending response with", enrolledStudents.length, "students"); // Add this
    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("Error in getEnrolledStudentsData:", error);
    res.json({ success: false, message: error.message });
  }
};