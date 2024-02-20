import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { upload, getassignments, deleteassignment, updateApprovalStatus, denyApprovalStatus, completeStatus } from "../controllers/upload.controller.js";


const router = express.Router();

router.post("/create", verifyToken, upload);

router.get("/getassignments", getassignments);

router.delete("/delete/:assignmentId/:userId", verifyToken, deleteassignment)

router.patch("/updateapproval/:assignmentId/user/:userId", verifyToken, updateApprovalStatus);

router.patch("/denyapproval/:assignmentId/user/:userId", verifyToken, denyApprovalStatus);

router.patch("/completed/:assignmentId/user/:userId", verifyToken, completeStatus);

export default router;
