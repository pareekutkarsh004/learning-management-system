import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createOrGetUser,
  purchaseCourse,
  UserEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  AddUserRating,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Get user data - this should use the router and call the controller
userRouter.get("/data", requireAuth(), getUserData);

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
