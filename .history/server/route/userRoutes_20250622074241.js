import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserData,
  purchaseCourse,
  UserEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  AddUserRating,
} from "../controllers/userController.js";

const userRouter = express.Router();

// ✅ Correct - returning proper JSON
app.get('/api/user/data', re, async (req, res) => {
  try {
    const clerkId = req.user.sub; // Extract from JWT token
    
    // Try to find user in database
    const user = await User.findOne({ clerkId });
    
    if (user) {
      // User exists - return user data
      res.json({
        success: true,
        user: {
          _id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledCourses: user.enrolledCourses || []
        }
      });
    } else {
      // User doesn't exist - return error
      res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});
userRouter.get("/enrolled-courses", requireAuth(), UserEnrolledCourses);
userRouter.post("/purchase", requireAuth(), purchaseCourse);
userRouter.post(
  "/update-course-progress",
  requireAuth(),
  updateUserCourseProgress
);
userRouter.get("/test", requireAuth(), (req, res) => {
  res.json({
    message: "✅ Auth test successful",
    userId: req.auth?.userId,
  });
});

userRouter.post("/get-course-progress", requireAuth(), getUserCourseProgress);
userRouter.post("/add-course-rating", requireAuth(), AddUserRating);

export default userRouter;
