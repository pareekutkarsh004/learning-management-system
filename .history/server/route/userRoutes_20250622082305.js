import express from "express";
import {
  getUserData,
  purchaseCourse,
  UserEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  AddUserRating,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMi.js"; // ⬅️ use your custom middleware

const userRouter = express.Router();

// Option A: Apply auth middleware to all routes
userRouter.use(authenticateUser);

// Routes (no need to call middleware individually now)
userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", UserEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-course-rating", AddUserRating);

// Auth test route
userRouter.get("/test", (req, res) => {
  res.json({
    message: "✅ Custom auth test successful",
    userId: req.auth?.userId,
  });
});

export default userRouter;
