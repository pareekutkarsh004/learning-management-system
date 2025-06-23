import express from 'express'
import { getUserData, purchaseCourse, UserEnrolledCourses,
    updateUserCourseProgress,getUserCourseProgress,AddUserRating } from '../controllers/userController.js'

const userRouter = express.Router()


router.get("/user-data", requireAuth(), getUserData);
 userRouter.get('/enrolled-courses',UserEnrolledCourses)
 userRouter.post('/purchase',purchaseCourse)
 
 userRouter.post('/update-course-progress',updateUserCourseProgress)
 userRouter.post('/get-course-progress',getUserCourseProgress)
 userRouter.post('/add-course-progress',AddUserRating)
 export default userRouter;