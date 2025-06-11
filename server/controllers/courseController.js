import Course from "../models/Course.js";

// Get all courses

export const getAllCourse = async (req,res) =>{
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate(paht : 'educator')

        res.json({success : true, courses})
    } catch (error) {
        res.json({success: false,message : error.message})
    }
}
//get Course By id

export const getCourseByid = async (req,res) =>{
    const {id} = req.params

    try {
        const courseData = await Course.findById(id).populate({path : 'educator'})

        // Remove lectureUrl if ispreviewfree if false

        courseData.courseContent.forEach(chapter =>{
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = ""
                }
            })
        })

        res.json({sucess : true,courseData })
    } catch (error) {
        res.json({success : false, message : error.message})
    }
}