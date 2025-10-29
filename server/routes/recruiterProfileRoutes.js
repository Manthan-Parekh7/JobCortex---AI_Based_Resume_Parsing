import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";
import { uploadProfileImage } from "../config/cloudinaryConfig.js";
import { updateUserProfile } from "../controllers/candidateController.js";

const router = express.Router();

// GET /recruiter/me/profile - get recruiter profile (for testing)
router.get("/me/profile", isAuthenticated, isVerified, isRecruiter, (req, res) => {
    res.json({
        success: true,
        message: "Recruiter profile access working",
        user: req.user,
    });
});

// PUT /recruiter/me/profile - update recruiter basic profile
router.put("/me/profile", isAuthenticated, isVerified, isRecruiter, uploadProfileImage.single("profileImage"), updateUserProfile);

export default router;
