// server/routes/authRoutes.js

import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Google OAuth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account consent",
    })
);

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), authController.googleCallback);

// GitHub OAuth
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"],
        prompt: "consent",
    })
);

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login", session: false }), authController.githubCallback);

// Local signup & login
router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.login);

// Token refresh & logout
router.post("/refresh_token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/logout", authController.logout);

export default router;
