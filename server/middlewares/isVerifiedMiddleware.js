import logger from "../config/logger.js";

export const isVerified = (req, res, next) => {
    if (!req.user) {
        // In case auth middleware was not applied before this
        logger.warn("Unauthorized access attempt: User not authenticated");
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    if (!req.user.isVerified) {
        logger.warn(`User ${req.user.email} attempted access but is not verified`);
        return res.status(403).json({ error: "Please verify your email first" });
    }
    logger.info(`User ${req.user.email} verified successfully`);
    next();
};
