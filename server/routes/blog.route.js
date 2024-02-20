import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { blog, deleteblog, getblogs, updateblog } from "../controllers/blog.controller.js";



const router = express.Router();

router.post("/create-blog", verifyToken, blog);

router.get("/getblogs", getblogs);

router.delete("/deleteblog/:blogId/:userId", verifyToken, deleteblog);

router.put('/updateblog/:blogId/:userId', verifyToken, updateblog)

export default router;
