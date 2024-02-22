import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createExpert, getExpert, deleteExpert } from "../controllers/expert.controller.js";



const router = express.Router();

router.post("/expert", verifyToken, createExpert);

router.get("/getexperts", getExpert);

router.delete("/delexperts/:expertId/:userId", verifyToken, deleteExpert);

// router.put('/updateblog/:blogId/:userId', verifyToken, updateblog)

export default router;
