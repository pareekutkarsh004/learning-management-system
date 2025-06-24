import User from "../models/User.model.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";
import { clerk } from "../utils/clerkClient.js";

// ✅ GET USER DATA - Create in MongoDB if not exists
// Add this controller to userController.js
// In userController.js
export const getUserData = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      console.log("User not found in database, creating new user...");

      // 🔍 Fetch from Clerk
      const clerkUser = await clerk.users.getUser(clerkUserId);
      console.log("✅ Clerk user data:", clerkUser);

      // ✅ Construct a valid MongoDB User with required fields
      const newUser = new User({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        imageUrl: clerkUser.imageUrl || clerkUser.profileImageUrl || "",
        role: clerkUser.publicMetadata.role || "student", // default
        enrolledCourses: [],
      });

      user = await newUser.save();
      console.log("✅ User created in MongoDB:", user);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ Error fetching from Clerk:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};
// ✅ GET ENROLLED COURSES
export const UserEnrolledCourses = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userData = await User.findOne({ clerkId }).populate(
      "enrolledCourses"
    );

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses || [],
    });
  } catch (error) {
    console.error("❌ Error in UserEnrolledCourses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PURCHASE COURSE (Stripe)
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const clerkId = req.auth.userId;

    console.log("🔍 Purchase attempt - clerkId:", clerkId);
    console.log("🔍 Purchase attempt - courseId:", courseId);

    // Input validation
    if (!clerkId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Please login" });
    }

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    // Validate courseId format (assuming MongoDB ObjectId)
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID format" });
    }

    // Fetch user and course data in parallel
    const [userData, courseData] = await Promise.all([
      User.findOne({ clerkId }),
      Course.findById(courseId),
    ]);

    console.log("🔍 userData found:", !!userData);
    console.log("🔍 courseData found:", !!courseData);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if course is available for purchase
    if (courseData.status !== "active" && courseData.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Course is not available for purchase",
      });
    }

    // Check if already enrolled
    if (userData.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Already purchased this course",
      });
    }

    // Calculate amount with better precision handling
    const basePrice = parseFloat(courseData.coursePrice) || 0;
    const discountPercent = parseFloat(courseData.discount) || 0;

    if (basePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    const discountAmount = (discountPercent * basePrice) / 100;
    const finalAmount = Math.max(0, basePrice - discountAmount);
    const amount = parseFloat(finalAmount.toFixed(2));

    console.log("💰 Base price:", basePrice);
    console.log("💰 Discount:", discountPercent + "%");
    console.log("💰 Final amount:", amount);

    // Validate minimum amount for Stripe (usually $0.50 USD)
    const minAmount = 0.5;
    if (amount < minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount is $${minAmount}`,
      });
    }

    // Create purchase record with proper field mapping
    const purchaseData = {
      courseId: courseData._id,
      userId: userData._id, // Standard naming
      userID: userData._id, // If model expects this format
      amount,
      status: "pending",
      createdAt: new Date(),
    };

    console.log("📋 Purchase data being created:", purchaseData);

    const newPurchase = await Purchase.create(purchaseData);

    console.log("📝 Purchase record created:", newPurchase._id);

    // Initialize Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not configured");
    }

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY?.toLowerCase() || "usd";

    // Validate origin for security
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      console.warn("⚠️ Unauthorized origin:", origin);
      return res.status(403).json({
        success: false,
        message: "Unauthorized origin",
      });
    }

    // Create Stripe session
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
            description:
              courseData.courseDescription ||
              `Access to ${courseData.courseTitle}`,
            images: courseData.courseImage ? [courseData.courseImage] : [],
          },
          unit_amount: Math.round(amount * 100), // Use Math.round for better precision
        },
        quantity: 1,
      },
    ];

    const sessionConfig = {
      success_url: `${origin}/loading/my-enrollments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${courseId}?cancelled=true`,
      line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
        courseId: courseId,
        userId: userData._id.toString(),
        clerkId: clerkId,
      },
      customer_email: userData.email,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes expiry
    };

    const session = await stripeInstance.checkout.sessions.create(
      sessionConfig
    );

    console.log("✅ Stripe session created:", session.id);

    // Update purchase record with session ID
    await Purchase.findByIdAndUpdate(newPurchase._id, {
      stripeSessionId: session.id,
    });

    res.json({
      success: true,
      session_url: session.url,
      purchase_id: newPurchase._id,
      amount: amount,
    });
  } catch (error) {
    console.error("❌ Error in purchaseCourse:", error);

    // Handle specific error types
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate purchase attempt",
      });
    }

    if (error.type === "StripeCardError") {
      return res.status(400).json({
        success: false,
        message: "Payment processing error",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// ✅ UPDATE COURSE PROGRESS
export const updateUserCourseProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userData = await User.findOne({ clerkId });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET COURSE PROGRESS
export const getUserCourseProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userData = await User.findOne({ clerkId });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({
      userId: userData._id,
      courseId,
    });

    res.json({ success: true, progressData });
  } catch (error) {
    console.error("❌ Error in getUserCourseProgress:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD COURSE RATING
export const AddUserRating = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const { courseId, rating } = req.body;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!courseId || !rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid rating data" });
    }

    const course = await Course.findById(courseId);
    const userData = await User.findOne({ clerkId });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userId = userData._id;

    if (!userData.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};
