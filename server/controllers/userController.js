import User from "../models/User.model.js";
import { Purchase } from "../models/Purchase.js";
<<<<<<< HEAD
import Stripe from "stripe"; 
import Course from "../models/Course.js";
import { messageInRaw } from "svix";

//Get user Data
export const getUserData = async (req,res)=>{
 
      try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({success : false, message : 'User Not Found' })
        }

        res.json({success : true, user})
      } catch (error) {
        res.json({success : false, message : error.message})
      }

}

//Users Enrolled Courses with lecture links

export const UserEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

       res.json({ success: true, enrolledCourses: userData.enrolledCourses });


    } catch (error) {
        res.json({success : false, message : error.message}) 
    }
}

// PURCHASE COURSE

export const purchaseCourse = async (req,res)=>{
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course  .findById(courseId)

        if(!userData || !courseData){
            res.json({success : false, message : 'Data not found'})
        }

        const purchaseData = {
            courseId : courseData._id,
            userId,
            amount : (courseData.coursePrice  - courseData.discount * courseData.coursePrice/100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        //Stripe Gateway Initialization 

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.Currency.toLowerCase()

        //Creating line items for the stripe 

        const line_items = [{
            price_data : {
                currency,
                product_data :{
                    name:courseData.courseTitle 

                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity  :1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-enrollments`,
            cancel_url : `${origin}/`,
            line_items : line_items,
            mode: 'payment',
            metadata : {
                purchaseId : newPurchase._id.toString()
            }
        })

        res.json({
            success: true,session_url : session_url
        })

    } catch (error) {
        res.json({success: false, message : error.message})
    }
}
=======
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";
import { clerk } from "../utils/clerkClient.js";
import mongoose from "mongoose";

// ✅ GET USER DATA - Create in MongoDB if not exists
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
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "Unknown User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        imageUrl: clerkUser.imageUrl || clerkUser.profileImageUrl || "",
        role: clerkUser.publicMetadata?.role || "student",
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

// ✅ BECOME EDUCATOR - Update role in both Clerk and MongoDB
export const becomeEducator = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    // Find user in MongoDB
    const user = await User.findOne({ clerkId: clerkUserId });

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
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.status(200).json({
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
    console.error("❌ Error upgrading to educator:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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

// ✅ PURCHASE COURSE (Stripe) - FIXED ObjectId casting issues
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
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
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
    if (!courseData.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course is not available for purchase",
      });
    }

    // Fix 11: Check if already enrolled using MongoDB ObjectId comparison
    if (
      courseData.enrolledStudents &&
      courseData.enrolledStudents.some(
        (studentId) => studentId.toString() === userData._id.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Already purchased this course",
      });
    }

    // Also check if user already has this course in enrolledCourses
    if (
      userData.enrolledCourses &&
      userData.enrolledCourses.some(
        (enrolledCourseId) =>
          enrolledCourseId.toString() === courseId.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
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

    // Create purchase record with proper ObjectId references
    const purchaseData = {
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: userData._id,
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
              courseData.courseDescription
                ?.replace(/<[^>]*>/g, "")
                .substring(0, 200) || `Access to ${courseData.courseTitle}`,
            images: courseData.courseThumbnail
              ? [courseData.courseThumbnail]
              : [],
          },
          unit_amount: Math.round(amount * 100),
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

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
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

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Fix 12: lectureId should be a string, not ObjectId based on your schema
    if (!lectureId || typeof lectureId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID format",
      });
    }

    let progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (!progressData.lectureCompleted.includes(lectureId)) {
        progressData.lectureCompleted.push(lectureId);
        await progressData.save();
      }
    } else {
      await CourseProgress.create({
        userId,
        courseId: new mongoose.Types.ObjectId(courseId),
        lectureCompleted: [lectureId], // Keep as string, not ObjectId
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const progressData = await CourseProgress.findOne({
      userId: userData._id,
      courseId: new mongoose.Types.ObjectId(courseId),
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
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

    // Check enrollment using ObjectId comparison
    const isEnrolled = userData.enrolledCourses.some(
      (enrolledCourseId) => enrolledCourseId.toString() === courseId.toString()
    );

    if (!isEnrolled) {
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
>>>>>>> main
