import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import logger from "../config/logger.js";
import { analyzeCandidateJobFit, analyzeResumeMistral } from "../ai/openrouterClient.js";
import { scheduleApplicationStatusEmail } from "../utils/emailService.js";

// View applications for a specific job
export const getApplicationsForJob = async (req, res) => {
    try {
        logger.info(`Attempting to fetch applications for job ID: ${req.params.jobId}, User: ${req.user.email}, User ID: ${req.user._id}`);

        // First check if the job exists at all
        const jobExists = await Job.findById(req.params.jobId);
        if (!jobExists) {
            logger.warn(`Job with ID ${req.params.jobId} does not exist in database`);
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        logger.info(`Job exists. Job recruiter: ${jobExists.recruiter}, Current user: ${req.user._id}`);

        // Now check if it belongs to the current user
        const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            logger.warn(`Job ${req.params.jobId} exists but is not owned by user ${req.user.email} (${req.user._id})`);
            return res.status(403).json({ success: false, message: "You don't have permission to view applications for this job" });
        }

        const applications = await Application.find({ job: req.params.jobId }).populate("candidate", "username email resume image");

        logger.info(`Fetched ${applications.length} applications for job ID ${req.params.jobId} by recruiter ${req.user.email}`);
        return res.json({ success: true, applications, job });
    } catch (err) {
        logger.error("Failed to fetch applications for job:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { appId, status } = req.params;
        const { interviewDetails, feedback } = req.body; // Optional details from recruiter

        if (!["accepted", "rejected", "pending"].includes(status)) {
            logger.warn(`Invalid status '${status}' attempted by user ${req.user.email} on application ${appId}`);
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        // Populate application with candidate and job details for email
        const app = await Application.findById(appId).populate("candidate", "username email").populate("job", "title").populate("recruiter", "companyId");

        if (!app) {
            logger.warn(`Application not found: ID ${appId}`);
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Ensure the recruiter owns this job
        if (app.recruiter._id.toString() !== req.user._id.toString()) {
            logger.warn(`User ${req.user.email} not authorized to update application ${appId}`);
            return res.status(403).json({ success: false, message: "Not authorized to update this application" });
        }

        // Get company details for email
        const company = await Company.findById(app.recruiter.companyId);
        const companyName = company ? company.name : "the company";

        // Store previous status to check if it actually changed
        const previousStatus = app.status;

        // Update application status
        app.status = status;
        app.updatedAt = new Date();
        await app.save();

        // Send email notification only if status actually changed and it's not pending
        if (previousStatus !== status && (status === "accepted" || status === "rejected")) {
            const candidateEmail = app.candidate.email;
            const candidateName = app.candidate.username;
            const jobTitle = app.job.title;

            // Schedule email with 30-second delay
            const emailDetails = status === "accepted" ? interviewDetails : feedback;
            scheduleApplicationStatusEmail(
                candidateEmail,
                candidateName,
                jobTitle,
                companyName,
                status,
                emailDetails,
                30000 // 30 seconds delay
            );

            logger.info(`Scheduled ${status} email for candidate ${candidateEmail} after 30 seconds`);
        }

        logger.info(`Application ${appId} status updated to '${status}' by user ${req.user.email}`);
        return res.json({
            success: true,
            message: `Application ${status} successfully. ${status !== "pending" ? "Candidate will be notified via email in 30 seconds." : ""}`,
            application: app,
        });
    } catch (err) {
        logger.error("Update application status error:", err);
        return res.status(500).json({ success: false, message: "Failed to update application status" });
    }
};

// AI-powered shortlist for recruiter's job with User as candidate model
export const getAIShortlistedApplications = async (req, res) => {
    try {
        // Verify job belongs to current recruiter
        const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or not yours" });
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

        return res.json({ success: true, applications: enhancedApplications });
    } catch (err) {
        logger.error("Failed to fetch AI shortlisted applications:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch AI shortlisted applications" });
    }
};

// Get application statistics for recruiter
export const getApplicationStats = async (req, res) => {
    try {
        // Get all jobs for the recruiter
        const recruiterJobs = await Job.find({ recruiter: req.user._id }).select("_id");
        const jobIds = recruiterJobs.map((job) => job._id);

        // Get application counts by status
        const [totalApplications, pendingApplications, acceptedApplications, rejectedApplications] = await Promise.all([Application.countDocuments({ job: { $in: jobIds } }), Application.countDocuments({ job: { $in: jobIds }, status: "pending" }), Application.countDocuments({ job: { $in: jobIds }, status: "accepted" }), Application.countDocuments({ job: { $in: jobIds }, status: "rejected" })]);

        logger.info(`Application stats for recruiter ${req.user.email}: Total: ${totalApplications}, Pending: ${pendingApplications}, Accepted: ${acceptedApplications}, Rejected: ${rejectedApplications}`);

        return res.json({
            success: true,
            stats: {
                totalApplications,
                pendingApplications,
                acceptedApplications,
                rejectedApplications,
            },
        });
    } catch (err) {
        logger.error("Failed to fetch application stats:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch application statistics" });
    }
};
