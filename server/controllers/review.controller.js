import Review from "../models/review.modal.js";

export const review = async (req, res, next) => {
  const { stars, description, userId } = req.body;

  try {
    const newReview = new Review({
      userId: userId,
      stars: stars,
      description: description,
    });
    await newReview.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

export const getreviews = async (req, res, next) => {
  try {
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const reviews = await Review.find()
      .sort({ updatedAt: sortDirection })
      .populate("userId", "username");
    res.status(200).json({ reviews });
  } catch (e) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};



export const deleteReview = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this"));
  }
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};
