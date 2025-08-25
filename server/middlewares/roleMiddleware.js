import logger from "../config/logger.js";

export const isRecruiter = (req, res, next) => {
    if (req.user?.role === "recruiter") {
        logger.debug(`Access granted to recruiter user ${req.user.email}`);
        return next();
    }
    logger.warn(`Access denied for user ${req.user?.email || "unknown"} - recruiter only`);
    return res.status(403).json({ error: "Access denied: recruiter only" });
};
