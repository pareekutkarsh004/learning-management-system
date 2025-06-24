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

// ✅ Apply requireAuth to the routes that need authentication:
userRouter.get("/user-data", requireAuth(), getUserData);
userRouter.get("/enrolled-courses", requireAuth(), UserEnrolledCourses);
userRouter.post("/purchase", requireAuth(), purchaseCourse);
userRouter.post(
  "/update-course-progress",
  requireAuth(),
  updateUserCourseProgress
);
userRouter.post("/get-course-progress", requireAuth(), getUserCourseProgress);
userRouter.post("/add-course-progress", requireAuth(), AddUserRating);

export default userRouter;
