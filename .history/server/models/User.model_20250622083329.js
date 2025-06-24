const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  email: String,
  role: {
    type: String,
    default: "student",
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

export default mongoose.model("User", userSchema);
