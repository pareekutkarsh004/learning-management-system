import express from 'express'
import { getUserData, purchaseCourse, UserEnrolledCourses } from '../controllers/userController.js'

const userRouter = express.Router()


 userRouter.get('/data',getUserData)
 userRouter.get('/enrolled-courses',UserEnrolledCourses)
 userRouter.post('/purchase',purchaseCourse)
 
 export default userRouter;