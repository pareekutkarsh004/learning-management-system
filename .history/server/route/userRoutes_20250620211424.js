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

userRouter.get("/data", requireAuth(), getUserData);
userRouter.get("/enrolled-courses", requireAuth(), UserEnrolledCourses);
userRouter.post("/purchase", requireAuth(), purchaseCourse);
userRouter.post(
  "/update-course-progress",
  requireAuth(),
  updateUserCourseProgress
);
router.get("/test", requireAuth(), (req, res) => {
  res.json({
    message: "✅ Auth test successful",
    userId: req.auth?.userId,
  });
});

userRouter.post("/get-course-progress", requireAuth(), getUserCourseProgress);
userRouter.post("/add-course-rating", requireAuth(), AddUserRating);

export default userRouter;
