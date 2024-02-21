import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createExpert, getExpert } from "../controllers/expert.controller.js";



const router = express.Router();

router.post("/expert", verifyToken, createExpert);

router.get("/getexperts", getExpert);

// router.delete("/deleteblog/:blogId/:userId", verifyToken, deleteblog);

// router.put('/updateblog/:blogId/:userId', verifyToken, updateblog)

export default router;
