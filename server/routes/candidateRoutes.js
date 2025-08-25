import express from "express";
import * as candidateController from "../controllers/candidateController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";
import { uploadResume } from "../config/cloudinaryConfig.js"; // Cloudinary Multer middleware

const router = express.Router();

// --- Public endpoints ---
router.get("/jobs", candidateController.listJobs);
router.get("/jobs/:jobId", candidateController.getJobDetails);

// --- Resume management (Candidate only) ---
router.post("/me/resume", isAuthenticated, isVerified, uploadResume.single("resume"), candidateController.uploadOrReplaceResume);
router.get("/me/resume", isAuthenticated, isVerified, candidateController.getResume);
router.delete("/me/resume", isAuthenticated, isVerified, candidateController.deleteResume);

// --- New AI Resume parsing endpoint ---
router.post("/me/parse-resume-cloudinary", isAuthenticated, isVerified, candidateController.parseResumeFromCloudinary);

// --- Job applications (Candidate only) ---
router.post("/jobs/:jobId/apply", isAuthenticated, isVerified, candidateController.applyToJob);
router.get("/me/applications", isAuthenticated, isVerified, candidateController.myApplications);
router.patch("/applications/:appId/withdraw", isAuthenticated, isVerified, candidateController.withdrawApplication);

export default router;
