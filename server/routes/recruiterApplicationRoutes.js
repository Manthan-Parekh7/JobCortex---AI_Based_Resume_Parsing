import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import * as recruiterAppController from "../controllers/recruiterApplicationController.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";

const router = express.Router();

router.get("/:jobId", isAuthenticated, isVerified, isRecruiter, recruiterAppController.getApplicationsForJob);
router.patch("/:appId/:status", isAuthenticated, isVerified, isRecruiter, recruiterAppController.updateApplicationStatus);

router.get("/:jobId/ai-shortlisted", isAuthenticated, isVerified, isRecruiter, recruiterAppController.getAIShortlistedApplications);

export default router;
