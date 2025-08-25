import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import logger from "../config/logger.js";
import User from "../models/User.js";

import pkg from "cloudinary";
const { v2: cloudinary } = pkg;

// AI/Parsing Helpers
import { extractTextFromPDF, extractTextFromDocx } from "../utils/fileParser.js";
import { analyzeResumeMistral } from "../ai/openrouterClient.js";
import { downloadFileBuffer } from "../utils/fileDownloader.js"; // function you create like above

// Get all active jobs (public)
export const listJobs = async (req, res) => {
    try {
        const { search, location, page = 1, limit = 10 } = req.query;
        const filter = { status: "active", isVisible: true };

        if (search) filter.title = { $regex: search, $options: "i" };
        if (location) filter.location = { $regex: location, $options: "i" };

        const jobs = await Job.find(filter)
            .populate("company", "name logo industry")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Job.countDocuments(filter);

        logger.info(`Fetched jobs list (page: ${page}, limit: ${limit}, search: ${search || "none"}, location: ${location || "none"})`);

        return res.json({
            jobs,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalJobs: total,
        });
    } catch (err) {
        logger.error("Error fetching jobs:", err);
        return res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

// Get single job by ID (public)
export const getJobDetails = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.jobId,
            status: "active",
            isVisible: true,
        }).populate("company", "name logo description website industry size");

        if (!job) {
            logger.warn(`Job not found: ID ${req.params.jobId}`);
            return res.status(404).json({ error: "Job not found" });
        }

        logger.info(`Fetched job details for job ID ${req.params.jobId}`);
        return res.json(job);
    } catch (err) {
        logger.error("Error fetching job details:", err);
        return res.status(500).json({ error: "Failed to fetch job details" });
    }
};

// Apply to a job (logged-in candidate, uses existing resume)
export const applyToJob = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            logger.warn(`User ${req.user.email} (role: ${req.user.role}) tried to apply but is not a candidate`);
            return res.status(403).json({ error: "Only candidates can apply" });
        }

        const job = await Job.findOne({
            _id: req.params.jobId,
            status: "active",
            isVisible: true,
        });
        if (!job) {
            logger.warn(`Job not found or not open for application: ID ${req.params.jobId}`);
            return res.status(404).json({ error: "Job not found or not open" });
        }

        const existing = await Application.findOne({
            job: job._id,
            candidate: req.user._id,
        });
        if (existing) {
            logger.warn(`User ${req.user.email} has already applied to job ID ${req.params.jobId}`);
            return res.status(400).json({ error: "You have already applied to this job" });
        }

        if (!req.user.resume) {
            logger.warn(`User ${req.user.email} has no resume uploaded yet`);
            return res.status(400).json({ error: "Please upload your resume before applying" });
        }

        const app = await Application.create({
            job: job._id,
            candidate: req.user._id,
            recruiter: job.recruiter,
            coverLetter: req.body?.coverLetter || "",
            resume: req.user.resume,
        });

        logger.info(`User ${req.user.email} applied to job ID ${req.params.jobId} successfully`);
        return res.status(201).json({ message: "Application submitted", application: app });
    } catch (err) {
        logger.error("Apply error:", err);
        return res.status(500).json({ error: "Failed to apply" });
    }
};

// Withdraw application
export const withdrawApplication = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            logger.warn(`User ${req.user.email} tried to withdraw application but is not a candidate`);
            return res.status(403).json({ error: "Only candidates can withdraw applications" });
        }

        const app = await Application.findOne({
            _id: req.params.appId,
            candidate: req.user._id,
        });

        if (!app) {
            logger.warn(`Application not found for withdrawal: ID ${req.params.appId}`);
            return res.status(404).json({ error: "Application not found" });
        }

        if (app.status === "withdrawn") {
            logger.warn(`Application ID ${req.params.appId} already withdrawn`);
            return res.status(400).json({ error: "Application already withdrawn" });
        }

        app.status = "withdrawn";
        await app.save();

        logger.info(`User ${req.user.email} withdrew application ID ${req.params.appId}`);
        return res.json({
            message: "Application withdrawn successfully",
            application: app,
        });
    } catch (err) {
        logger.error("Withdraw application error:", err);
        return res.status(500).json({ error: "Failed to withdraw application" });
    }
};

// View all applications for logged-in candidate
export const myApplications = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            logger.warn(`User ${req.user.email} attempted to view applications but is not a candidate`);
            return res.status(403).json({ error: "Only candidates can view applications" });
        }

        const apps = await Application.find({ candidate: req.user._id }).populate("job", "title company status").populate("recruiter", "username email");

        logger.info(`Fetched all applications for user ${req.user.email}`);
        return res.json(apps);
    } catch (err) {
        logger.error("Failed to fetch applications:", err);
        return res.status(500).json({ error: "Failed to fetch applications" });
    }
};

// Upload or replace resume for logged-in candidate
export const uploadOrReplaceResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No resume file uploaded" });

        const user = await User.findById(req.user._id);

        // Block upload if resume already exists
        if (user.resume) {
            return res.status(400).json({
                error: "You already have a resume uploaded. Please delete it before uploading a new one.",
            });
        }

        // Save resume URL and publicId for Cloudinary deletion later
        user.resume = req.file.path; // Cloudinary URL
        user.resumePublicId = req.file.filename; // Cloudinary public_id
        await user.save();

        logger.info(`Resume uploaded for user ${req.user.email}`);
        res.json({
            message: "Resume uploaded successfully",
            resume: user.resume,
        });
    } catch (err) {
        logger.error("Resume upload error:", err);
        res.status(500).json({ error: "Failed to upload resume" });
    }
};

// Get current resume for logged-in candidate
export const getResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("resume");
        if (!user.resume) return res.status(404).json({ error: "No resume uploaded" });
        res.json({ resume: user.resume });
    } catch (err) {
        logger.error("Get resume error:", err);
        res.status(500).json({ error: "Failed to get resume" });
    }
};

// Delete resume (including removing from Cloudinary) for logged-in candidate
export const deleteResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.resumePublicId) {
            return res.status(404).json({ error: "No resume to delete" });
        }

        // Delete from Cloudinary; specify resource_type for raw files
        const deleteResult = await cloudinary.uploader.destroy(user.resumePublicId, {
            resource_type: "raw",
        });

        if (deleteResult.result !== "ok") {
            logger.warn(`Cloudinary deletion failed for ${user.resumePublicId}: ${deleteResult.result}`);
            return res.status(500).json({ error: "Failed to delete resume from cloud storage" });
        }

        // Remove from the user document
        user.resume = undefined;
        user.resumePublicId = undefined;
        await user.save();

        logger.info(`Resume deleted for user ${req.user.email}`);
        res.json({ message: "Resume deleted successfully" });
    } catch (err) {
        logger.error("Delete resume error:", err);
        res.status(500).json({ error: "Failed to delete resume" });
    }
};

// --------- AI Resume Parsing Endpoint ---------
export const parseResumeFromCloudinary = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.resume) return res.status(400).json({ error: "No resume uploaded" });

        // Download file buffer from Cloudinary URL
        const fileBuffer = await downloadFileBuffer(user.resume);

        // Detect mimetype from URL extension (simplified)
        const isPdf = user.resume.endsWith(".pdf");
        const isDocx = user.resume.endsWith(".docx");

        let text;
        if (isPdf) {
            text = await extractTextFromPDF(fileBuffer);
        } else if (isDocx) {
            text = await extractTextFromDocx(fileBuffer);
        } else {
            return res.status(400).json({ error: "Unsupported resume file format" });
        }

        const jobGoal = req.body.jobGoal || "";
        const aiOutput = await analyzeResumeMistral(text, jobGoal);

        // Parse AI output string JSON (strip markdown/code if needed)
        let parsedOutput;
        try {
            // Remove triple backticks and any leading "json\n"
            let cleaned = aiOutput
                .trim()
                .replace(/^```json\s*/i, "")
                .replace(/^```/, "")
                .replace(/```$/i, "")
                .trim();

            parsedOutput = JSON.parse(cleaned);
        } catch (err) {
            console.error("AI output could not be parsed as JSON:", aiOutput);
            parsedOutput = { raw: aiOutput };
        }

        return res.json({ ai_output: parsedOutput });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
