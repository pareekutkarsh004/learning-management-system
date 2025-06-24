import express from "express";
import {
  getUserData,
  becomeEducator,
  UserEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  AddUserRating,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const userRouter = express.Router();

// ✅ Get user data
userRouter.get("/profile", authenticateUser, getUserData);

// ✅ Become educator route
userRouter.patch("/become-educator", requireAuth(), becomeEducator);

// ✅ Get enrolled courses
userRouter.get("/enrolled-courses", authenticateUser, UserEnrolledCourses);

// ✅ Purchase course
userRouter.post("/purchase-course", authenticateUser, purchaseCourse);

// ✅ Update course progress
userRouter.post("/course-progress", authenticateUser, updateUserCourseProgress);

// ✅ Get course progress
userRouter.post(
  "/get-course-progress",
  authenticateUser,
  getUserCourseProgress
);

// ✅ Add rating
userRouter.post("/add-rating", authenticateUser, AddUserRating);

export default userRouter;
