import express from "express";
import { deleteReview, getreviews, review } from "../controllers/review.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, review);

router.get("/getreviews", getreviews);

router.delete("/deleteReview/:reviewId/:userId", verifyToken, deleteReview);

export default router;