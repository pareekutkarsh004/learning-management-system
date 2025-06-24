<<<<<<< HEAD
import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    enrolledCourses:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course'
         }
    ]
},{timestamps:true});

const User = mongoose.model('User',userSchema);


export default User;
=======
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "educator"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
>>>>>>> main
