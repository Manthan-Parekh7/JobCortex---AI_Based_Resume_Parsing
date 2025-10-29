import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import logger from "../config/logger.js"; // Winston logger import

// Create a job - recruiter only
export const createJob = async (req, res) => {
    try {
        if (!req.user.companyId) {
            logger.warn(`User ${req.user.email} attempted to create job without a company profile`);
            return res.status(400).json({ success: false, message: "You must create a company profile before posting jobs" });
        }

        const company = await Company.findById(req.user.companyId);
        if (!company) {
            logger.warn(`Company not found for user ${req.user.email} with companyId ${req.user.companyId}`);
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        const { title, description, responsibilities, requirements, salary, location, jobType } = req.body;

        const job = await Job.create({
            title,
            description,
            responsibilities,
            requirements,
            salary,
            location,
            jobType,
            company: req.user.companyId,
            recruiter: req.user._id,
        });

        logger.info(`Job created successfully by user ${req.user.email}, job ID: ${job._id}`);
        return res.status(201).json({ success: true, message: "Job created successfully", job });
    } catch (err) {
        logger.error("Create job error:", err);
        return res.status(500).json({ success: false, message: "Failed to create job" });
    }
};

// Get all jobs for logged-in recruiter
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id }).populate("company", "name logo");

        // Add application counts for each job
        const jobsWithApplications = await Promise.all(
            jobs.map(async (job) => {
                const applicationCount = await Application.countDocuments({ job: job._id });
                const jobObj = job.toObject();
                jobObj.applicationCount = applicationCount;
                return jobObj;
            })
        );

        logger.info(`Fetched jobs for recruiter ${req.user.email}, jobs count: ${jobs.length}`);
        return res.json({ success: true, jobs: jobsWithApplications });
    } catch (err) {
        logger.error(`Failed to fetch jobs for recruiter ${req.user.email}:`, err);
        return res.status(500).json({ success: false, message: "Failed to fetch jobs" });
    }
};

// Get a single job
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate("company", "name logo");
        if (!job) {
            logger.warn(`Job not found with ID: ${req.params.jobId}`);
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        logger.info(`Fetched job details for job ID: ${req.params.jobId}`);
        return res.json({ success: true, job });
    } catch (err) {
        logger.error(`Failed to fetch job ID ${req.params.jobId}:`, err);
        return res.status(500).json({ success: false, message: "Failed to fetch job" });
    }
};

// Update a job (recruiter must own it)
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            logger.warn(`Job not found or not owned by user ${req.user.email}, job ID: ${req.params.jobId}`);
            return res.status(404).json({ success: false, message: "Job not found or not yours" });
        }

        Object.assign(job, req.body);
        await job.save();

        logger.info(`Job updated by user ${req.user.email}, job ID: ${job._id}`);
        return res.json({ success: true, message: "Job updated", job });
    } catch (err) {
        logger.error(`Failed to update job ID ${req.params.jobId}:`, err);
        return res.status(500).json({ success: false, message: "Failed to update job" });
    }
};

// Update job status (active/inactive)
export const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body; // expecting { status: "active" | "inactive" }

        if (!["active", "inactive"].includes(status)) {
            logger.warn(`Invalid status '${status}' attempted by user ${req.user.email} on job ${req.params.jobId}`);
            return res.status(400).json({ success: false, message: "Invalid status. Must be 'active' or 'inactive'" });
        }

        const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            logger.warn(`Job not found or not owned by user ${req.user.email}, job ID: ${req.params.jobId}`);
            return res.status(404).json({ success: false, message: "Job not found or not yours" });
        }

        job.status = status;
        await job.save();

        logger.info(`Job status updated to '${status}' by user ${req.user.email}, job ID: ${job._id}`);
        return res.json({ success: true, message: `Job ${status === "active" ? "activated" : "deactivated"}`, job });
    } catch (err) {
        logger.error(`Failed to update job status for job ID ${req.params.jobId}:`, err);
        return res.status(500).json({ success: false, message: "Failed to update job status" });
    }
};

// Delete a job (recruiter must own it)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.jobId, recruiter: req.user._id });
        if (!job) {
            logger.warn(`Job not found or not owned by user ${req.user.email}, job ID: ${req.params.jobId}`);
            return res.status(404).json({ success: false, message: "Job not found or not yours" });
        }

        logger.info(`Job deleted by user ${req.user.email}, job ID: ${req.params.jobId}`);
        return res.json({ success: true, message: "Job deleted" });
    } catch (err) {
        logger.error(`Failed to delete job ID ${req.params.jobId}:`, err);
        return res.status(500).json({ success: false, message: "Failed to delete job" });
    }
};
