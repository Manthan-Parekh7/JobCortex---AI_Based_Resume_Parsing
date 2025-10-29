import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import logger from "../config/logger.js";

// Get unique candidates who applied to any job owned by the recruiter
export const getCandidatesAppliedToMyJobs = async (req, res) => {
    try {
        const myJobs = await Job.find({ recruiter: req.user._id }).select("_id");
        const jobIds = myJobs.map((j) => j._id);

        if (jobIds.length === 0) {
            return res.json({ success: true, candidates: [] });
        }

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate("candidate", "username email image skills experience education projects summary location resume")
            .lean();

        const uniqueMap = new Map();
        for (const app of applications) {
            const c = app.candidate;
            if (c && !uniqueMap.has(String(c._id))) {
                uniqueMap.set(String(c._id), c);
            }
        }

        const candidates = Array.from(uniqueMap.values());
        logger.info(`Found ${candidates.length} unique candidates applied to recruiter's jobs`);
        return res.json({ success: true, candidates });
    } catch (err) {
        logger.error("Failed to fetch applied candidates:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch applied candidates" });
    }
};

// Search candidates by skills or free-text (username, email, summary, about)
export const searchCandidates = async (req, res) => {
    try {
        const { q = "", skills = "", page = 1, limit = 10 } = req.query;
        const filter = { role: "candidate" };

        const andClauses = [];
        if (q) {
            const regex = new RegExp(q, "i");
            andClauses.push({ $or: [{ username: regex }, { email: regex }, { summary: regex }, { about: regex }] });
        }
        if (skills) {
            // skills can be comma-separated list of skill names
            const skillList = skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            if (skillList.length > 0) {
                andClauses.push({ "skills.name": { $in: skillList } });
            }
        }
        if (andClauses.length > 0) filter.$and = andClauses;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [candidates, total] = await Promise.all([User.find(filter).select("username email image skills summary about location experience education projects resume").sort({ updatedAt: -1 }).skip(skip).limit(parseInt(limit)).lean(), User.countDocuments(filter)]);

        return res.json({
            success: true,
            candidates,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total,
        });
    } catch (err) {
        logger.error("Candidate search failed:", err);
        return res.status(500).json({ success: false, message: "Failed to search candidates" });
    }
};
