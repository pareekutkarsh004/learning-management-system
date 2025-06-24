import mongoose from "mongoose";

<<<<<<< HEAD
const lectureSchema = new mongoose.Schema({
     lectureId:{type : String, required: true},
     lectureTitle: {type: String, required:true},
     lectureDuration: {type: Number, required:true},
     isPreviewFree: {type: Boolean, required:true},
     lectureOrder: {type: Number, required:true}
},{_id: false });

const chapterSchema=new mongoose.Schema({
    chapterId:{type:String,required:true},
    chapterOrder:{type:Number, required:true},
    chapterTite:{type: String, required: true},
    chapterContent:[lectureSchema]
},{_id : false}); // _id: false because when newchapter is created we do not need it's id as we are already providing id 
 
const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    courseThumbnail:{
        type:String,
    },
    coursePrice:{
         type:Number,
         required:true
    },
    isPublished:{
        type:Boolean,
        default:true 
    },
    discount:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    courseContent:[chapterSchema],
    courseRatings:[
        {
            userId:{type:String},rating:{type:Number, min:1, max:5 }
        }
    ],
    educator:{type:String,ref:'User',required:true},
    enrolledStudents:[
        {type:String,ref:'User '}
    ]
},{timestamps:true, minimize: false });

 const Course = mongoose.model('Course', courseSchema)

 export default Course;
  
=======
// ✅ 1. Lecture Schema (embedded inside chapters)
const lectureSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true }, // in minutes
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true },
    // Fix 6: Add lectureUrl field that was being referenced in controller
    lectureUrl: { type: String, default: "" },
  },
  { _id: false }
);

// ✅ 2. Chapter Schema (embedded inside course)
const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema],
  },
  { _id: false }
);

// ✅ 3. Course Schema
const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String }, // URL (can be GridFS or Cloudinary)
    coursePrice: { type: Number, required: true },

    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },

    courseContent: [chapterSchema],

    courseRatings: [
      {
        // Fix 7: Change to ObjectId to match userController logic
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, min: 1, max: 5, required: true },
      },
    ],

    // Fix 8: Keep as String since it stores clerkId, but add index for better performance
    educator: {
      type: String,
      required: true,
      index: true, // Add index for better query performance
    },

    // Fix 9: Change to ObjectId to match the logic in userController
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

// Fix 10: Add indexes for better query performance
courseSchema.index({ isPublished: 1 });
courseSchema.index({ educator: 1 });
courseSchema.index({ courseTitle: "text", courseDescription: "text" });

// ✅ 4. Export Course Model
const Course = mongoose.model("Course", courseSchema);
export default Course;
>>>>>>> main
