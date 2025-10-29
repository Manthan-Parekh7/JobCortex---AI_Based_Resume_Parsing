import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import * as recruiterAppController from "../controllers/recruiterApplicationController.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";

const router = express.Router();

// Get application statistics (must be before /:jobId route)
router.get("/stats", isAuthenticated, isVerified, isRecruiter, recruiterAppController.getApplicationStats);

router.get("/:jobId", isAuthenticated, isVerified, isRecruiter, recruiterAppController.getApplicationsForJob);

// Update application status (supports both simple and detailed updates)
router.patch("/:appId/:status", isAuthenticated, isVerified, isRecruiter, recruiterAppController.updateApplicationStatus);
router.put("/:appId/:status", isAuthenticated, isVerified, isRecruiter, recruiterAppController.updateApplicationStatus);

router.get("/:jobId/ai-shortlisted", isAuthenticated, isVerified, isRecruiter, recruiterAppController.getAIShortlistedApplications);

export default router;
