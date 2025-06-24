// routes/user.js
import express from "express";
import {
  authenticateUser,
  protectEducator,
  getUserData,
  getUserEnrolledCourses,
} from "../middlewares/authMiddleware.js"; // or wherever you put these functions

const router = express.Router();

// Test route (you can remove this after testing)
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "User API is working",
    timestamp: new Date().toISOString(),
  });
});

// Get user profile data - protected route
router.get("/data", authenticateUser, getUserData);

// Get user's enrolled courses - protected route
router.get("/enrolled-courses", authenticateUser, getUserEnrolledCourses);

// Example educator-only route
router.get("/educator-only", protectEducator, (req, res) => {
  res.json({
    success: true,
    message: "This is an educator-only endpoint",
    user: req.user,
  });
});

export default router;
