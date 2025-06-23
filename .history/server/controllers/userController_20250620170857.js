import User from "../models/User.model.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";
import { clerk } from "../utils/clerkClient.js";

// ✅ GET USER DATA - Create in MongoDB if not exists
export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userFromClerk = await clerk.users.getUser(clerkId);

    let user = await User.findOne({ clerkId });

    if (!user) {
      console.log("🆕 Creating new user in MongoDB...");
      user = await User.create({
        clerkId,
        name: `${userFromClerk.firstName} ${userFromClerk.lastName}`,
        email: userFromClerk.emailAddresses[0].emailAddress,
        imageUrl: userFromClerk.imageUrl,
        enrolledCourses: [],
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Error in getUserData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ENROLLED COURSES
export const UserEnrolledCourses = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const userData = await User.findOne({ clerkId }).populate(
      "enrolledCourses"
    );

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    console.error("❌ Error in UserEnrolledCourses:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ PURCHASE COURSE (Stripe)
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const clerkId = req.auth?.userId;

    const userData = await User.findOne({ clerkId });
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data not found" });
    }

    if (userData.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "Already purchased this course",
      });
    }

    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId: userData._id,
      amount,
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.Currency.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: courseData.courseTitle },
          unit_amount: Math.floor(amount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: { purchaseId: newPurchase._id.toString() },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("❌ Error in purchaseCourse:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ UPDATE COURSE PROGRESS
export const updateUserCourseProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const userData = await User.findOne({ clerkId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const userId = userData._id;
    const { courseId, lectureId } = req.body;

    let progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (!progressData.lectureCompleted.includes(lectureId)) {
        progressData.lectureCompleted.push(lectureId);
        await progressData.save();
      }
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    console.error("❌ Error in updateUserCourseProgress:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET COURSE PROGRESS
export const getUserCourseProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const userData = await User.findOne({ clerkId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({
      userId: userData._id,
      courseId,
    });

    res.json({ success: true, progressData });
  } catch (error) {
    console.error("❌ Error in getUserCourseProgress:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ ADD COURSE RATING
export const AddUserRating = async (req, res) => {
  const clerkId = req.auth?.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid rating data" });
  }

  try {
    const course = await Course.findById(courseId);
    const userData = await User.findOne({ clerkId });

    if (!course || !userData) {
      return res.json({ success: false, message: "User or course not found" });
    }

    const userId = userData._id;

    if (!userData.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not enrolled in this course",
      });
    }

    const existing = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existing !== -1) {
      course.courseRatings[existing].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    res.json({ success: true, message: "Rating submitted" });
  } catch (error) {
    console.error("❌ Error in AddUserRating:", error);
    res.json({ success: false, message: error.message });
  }
};
