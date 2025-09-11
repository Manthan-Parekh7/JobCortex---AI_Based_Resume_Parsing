import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import logger from "../config/logger.js";
import { analyzeCandidateJobFit, analyzeResumeMistral } from "../ai/openrouterClient.js";

// View applications for a specific job
export const getApplicationsForJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            logger.warn(`Job not found or not owned by user ${req.user.email}, job ID: ${req.params.jobId}`);
            return res.status(404).json({ error: "Job not found or not yours" });
        }

        const applications = await Application.find({ job: req.params.jobId }).populate("candidate", "username email resume");

        logger.info(`Fetched ${applications.length} applications for job ID ${req.params.jobId} by recruiter ${req.user.email}`);
        return res.json(applications);
    } catch (err) {
        logger.error("Failed to fetch applications for job:", err);
        return res.status(500).json({ error: "Failed to fetch applications" });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { appId, status } = req.params;

        if (!["accepted", "rejected"].includes(status)) {
            logger.warn(`Invalid status '${status}' attempted by user ${req.user.email} on application ${appId}`);
            return res.status(400).json({ error: "Invalid status" });
        }

        const app = await Application.findById(appId);
        if (!app) {
            logger.warn(`Application not found: ID ${appId}`);
            return res.status(404).json({ error: "Application not found" });
        }

        // Ensure the recruiter owns this job
        if (app.recruiter.toString() !== req.user._id.toString()) {
            logger.warn(`User ${req.user.email} not authorized to update application ${appId}`);
            return res.status(403).json({ error: "Not authorized to update this application" });
        }

        app.status = status;
        await app.save();

        logger.info(`Application ${appId} status updated to '${status}' by user ${req.user.email}`);
        return res.json({ message: `Application ${status} successfully`, application: app });
    } catch (err) {
        logger.error("Update application status error:", err);
        return res.status(500).json({ error: "Failed to update application status" });
    }
};

// AI-powered shortlist for recruiter's job with User as candidate model
export const getAIShortlistedApplications = async (req, res) => {
    try {
        // Verify job belongs to current recruiter
        const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            return res.status(404).json({ error: "Job not found or not yours" });
        }

        // Get applications and populate User candidate fields needed (resumeText and summary for AI)
        const applications = await Application.find({ job: req.params.jobId }).populate("candidate", "username email resumeText summary");

        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                const candidate = app.candidate;
                let summary = candidate.summary;

                try {
                    const resumeText = candidate.resumeText;
                    if (!resumeText) {
                        logger.warn(`No resume text for candidate ${candidate._id}, skipping`);
                        return { ...app.toObject(), fit_score: null, fit_explanation: "Resume not parsed" };
                    }

                    // Generate and cache summary if missing
                    if (!summary) {
                        const aiSummaryRaw = await analyzeResumeMistral(resumeText, "");
                        let cleanedSummary = aiSummaryRaw.trim().replace(/^```/, "").replace(/```$/, "").trim();
                        const parsedSummary = JSON.parse(cleanedSummary);
                        summary = parsedSummary.summary || "";
                        // Save generated summary to User collection
                        await User.findByIdAndUpdate(candidate._id, { $set: { summary } }, { new: true });
                    }

                    // AI fit score analysis
                    const fitData = await analyzeCandidateJobFit(job.description, summary);

                    return {
                        ...app.toObject(),
                        fit_score: fitData.fit_score,
                        fit_explanation: fitData.explanation,
                        summary,
                    };
                } catch (error) {
                    logger.error(`AI scoring failed for app ${app._id}:`, error);
                    return { ...app.toObject(), fit_score: null, fit_explanation: "AI error or resume summary unavailable" };
                }
            })
        );

        // Sort applications by fit score descending
        enhancedApplications.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0));

        return res.json(enhancedApplications);
    } catch (err) {
        logger.error("Failed to fetch AI shortlisted applications:", err);
        return res.status(500).json({ error: "Failed to fetch AI shortlisted applications" });
    }
};
