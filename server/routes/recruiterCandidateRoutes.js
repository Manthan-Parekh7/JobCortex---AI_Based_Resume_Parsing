import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";
import * as controller from "../controllers/recruiterCandidateController.js";

const router = express.Router();

// List unique candidates who applied to any of the recruiter's jobs
router.get("/applied", isAuthenticated, isVerified, isRecruiter, controller.getCandidatesAppliedToMyJobs);

// Search candidates by skills/text
router.get("/search", isAuthenticated, isVerified, isRecruiter, controller.searchCandidates);

export default router;
