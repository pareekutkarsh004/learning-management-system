import User from "../models/User.model.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe"; 
import Course from "../models/Course.js";
import { messageInRaw } from "svix";
import CourseProgress from "../models/CourseProgress.js";

//Get user Data
export const getUserData = async (req,res)=>{
 
      try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({success : false, message : 'User Not Found' })
        }

        res.json({success : true, user})
      } catch (error) {
        res.json({success : false, message : error.message})
      }

}

//Users Enrolled Courses with lecture links

export const UserEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

       res.json({ success: true, enrolledCourses: userData.enrolledCourses });


    } catch (error) {
        res.json({success : false, message : error.message}) 
    }
}

// PURCHASE COURSE

export const purchaseCourse = async (req,res)=>{
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course  .findById(courseId)

        if(!userData || !courseData){
            res.json({success : false, message : 'Data not found'})
        }

        const purchaseData = {
            courseId : courseData._id,
            userId,
            amount : (courseData.coursePrice  - courseData.discount * courseData.coursePrice/100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        //Stripe Gateway Initialization 

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.Currency.toLowerCase()

        //Creating line items for the stripe 

        const line_items = [{
            price_data : {
                currency,
                product_data :{
                    name:courseData.courseTitle 

                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity  :1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-enrollments`,
            cancel_url : `${origin}/`,
            line_items : line_items,
            mode: 'payment',
            metadata : {
                purchaseId : newPurchase._id.toString()
            }
        })

        res.json({
            success: true,session_url : session_url
        })

    } catch (error) {
        res.json({success: false, message : error.message})
    }
}

// update User Course Progress
export const updateUserCourseProgress = async(req,res)=>{
    try {
        const userId= req.auth.userId
        const {courseId,lectureId} = req.body
        const progressData =await CourseProgress.findOne({userId,courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true,message:'Lecture Already Completed.'})
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save();
        }
        else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted:[lectureId]
            })
        }

        res.json({success:true, message:'Progress Updated.'})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// get User Course Progress
export const getUserCourseProgress = async(req,res)=>{
    try {
        const userId= req.auth.userId
        const {courseId,lectureId} = req.body
        const progressData =await CourseProgress.findOne({userId,courseId})
        res.json({success:true, progressData})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Add User Rating to Course
export const AddUserRating = async(req,res)=>{
    
    const userId= req.auth.userId
    const{courseId,rating}= req.body
    
    if(!courseId || !userId || !rating || rating<1 || rating>5){
       return res.json({success:false, message:'Invalid Details.'}) 
    }

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.json({success:false,message:'Course not found.'})
        }

        const user = await User.findById(userId);
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false , message:'User has not purchased this course.'});
        }

        const existingRatingIndex = course.courseRatings.findIndex(r=> r.userId === userId);
       
        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else{
            course.courseRatings.push({userId,rating});
        }
        await courseData.save();

        return res.json({success:true, message:'Rating added'});

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}