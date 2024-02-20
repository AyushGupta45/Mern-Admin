import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      description: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
);
  
const Review = mongoose.model("Review", reviewSchema);
  
export default Review;
