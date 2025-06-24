import express from 'express';
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator
} from '../controllers/educatorController.js';

import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';
import { requireAuth } from '@clerk/express';

const educatorRouter = express.Router();

// ✅ Only needs requireAuth because it’s available to any user (educator or not)
educatorRouter.get('/update-role', requireAuth(), updateRoleToEducator);

// ✅ All below routes are educator-protected
educatorRouter.post('/add-course', protectEducator, upload.single('image'), addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

export default educatorRouter;
