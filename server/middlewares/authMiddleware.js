// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../config/logger.js";

export const isAuthenticated = async (req, res, next) => {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;
    const isProd = process.env.NODE_ENV === "production";

    // Helper to set auth cookies
    const setAuthCookies = (access, refresh) => {
        res.cookie("access_token", access, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: "/",
        });
        res.cookie("refresh_token", refresh, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });
    };

    try {
        if (accessToken) {
            logger.debug("Verifying access token");
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (user) {
                logger.info(`Access token valid for user ${user.email}`);
                req.user = user;
                return next(); // Access token valid, proceed
            }
            logger.warn("User not found for valid access token");
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            logger.info("Access token expired, attempting to refresh token");
            // continue to refresh token flow
        } else {
            logger.warn(`Invalid access token: ${err.message}`);
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
    }

    if (!refreshToken) {
        logger.warn("No refresh token found in the request");
        return res.status(401).json({ error: "Unauthorized: No refresh token" });
    }

    try {
        logger.debug("Verifying refresh token");
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decodedRefresh.id);
        if (!user || user.refreshToken !== refreshToken) {
            logger.warn(`Invalid session or refresh token mismatch for user ID ${decodedRefresh.id}`);
            return res.status(401).json({ error: "Unauthorized: Invalid refresh token" });
        }

        // Generate new access and refresh tokens
        const newAccessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

        const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // Save rotated refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set new tokens as cookies
        setAuthCookies(newAccessToken, newRefreshToken);

        logger.info(`Refresh token rotated, new tokens set for user ${user.email}`);
        req.user = user;
        return next();
    } catch (err) {
        logger.error(`Refresh token verification failed: ${err.message}`);
        return res.status(401).json({ error: "Unauthorized: Refresh failed" });
    }
};
