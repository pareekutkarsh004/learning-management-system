<<<<<<< HEAD
 import express from 'express'
 import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import { protectEducator } from '../middlewares/authMiddleware.js'
import upload from '../configs/multer.js'
import { requireAuth } from '@clerk/express'
 const educatorRouter = express.Router()

 //add educator role
 educatorRouter.get('/update-role', requireAuth() ,updateRoleToEducator )
 educatorRouter.post('/add-course',requireAuth(), upload.single('image'),protectEducator, addCourse)
 educatorRouter.get('/courses',requireAuth(), protectEducator, getEducatorCourses)
 educatorRouter.get('/dashboard',requireAuth(), protectEducator, educatorDashboardData)
 educatorRouter.get('/enrolled-students',requireAuth(), protectEducator, getEnrolledStudentsData )
 
 export default educatorRouter; 

=======
import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
} from "../controllers/educatorController.js";

import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
import { requireAuth } from "@clerk/express";

const educatorRouter = express.Router();

// ✅ Route to update role to educator - available to any authenticated user
educatorRouter.patch("/update-role", requireAuth(), updateRoleToEducator);

// ✅ All below routes are educator-protected
educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"),
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
>>>>>>> main
