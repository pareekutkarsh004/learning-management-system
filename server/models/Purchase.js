import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
  },
  { timestamps: true }
);

// Add indexes for better performance
PurchaseSchema.index({ userId: 1, courseId: 1 });
PurchaseSchema.index({ stripeSessionId: 1 });

export const Purchase = mongoose.model("Purchase", PurchaseSchema);
