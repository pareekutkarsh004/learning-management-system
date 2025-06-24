import express from 'express';
import { getAllCourse, getCourseByid } from '../controllers/courseController.js';

const courseRouter = express.Router()

courseRouter.get('/all',getAllCourse)
courseRouter.get('/:id',getCourseByid)

export default courseRouter;


