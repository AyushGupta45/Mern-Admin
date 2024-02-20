import express from "express";
<<<<<<< HEAD
import { google, signin, signup, verifyEmail } from "../controllers/auth.controller.js";
=======
import { google, signin, signup } from "../controllers/auth.controller.js";
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
<<<<<<< HEAD
router.post("/verify-email/:verificationToken", verifyEmail);
=======
>>>>>>> 84d0d0fbe96aae7d8cd6a48ca1d41a389c33b7f7

export default router;
