import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import * as jobController from "../controllers/jobController.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";

const router = express.Router();

// Recruiter job management
router.post("/", isAuthenticated, isRecruiter, isVerified, jobController.createJob);
router.get("/my", isAuthenticated, isRecruiter, isVerified, jobController.getMyJobs);
router.get("/:jobId", isAuthenticated, isRecruiter, isVerified, jobController.getJobById);
router.put("/:jobId", isAuthenticated, isRecruiter, isVerified, jobController.updateJob);
router.put("/:jobId/status", isAuthenticated, isRecruiter, isVerified, jobController.updateJobStatus);
router.delete("/:jobId", isAuthenticated, isRecruiter, isVerified, jobController.deleteJob);

export default router;
