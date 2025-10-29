import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connection.js";
import passport from "./utils/passport.js";
import authRoutes from "./routes/authRoutes.js";
import { isAuthenticated } from "./middlewares/authMiddleware.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import recruiterApplicationRoutes from "./routes/recruiterApplicationRoutes.js";
import recruiterProfileRoutes from "./routes/recruiterProfileRoutes.js";
import recruiterCandidateRoutes from "./routes/recruiterCandidateRoutes.js";
import logger from "./config/logger.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config for both dev & prod
app.use(
    cors({
        origin: isProd ? process.env.CLIENT_URL : "http://localhost:5173",
        credentials: true,
    })
);

// Initialize passport
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/company", companyRoutes);
app.use("/jobs", jobRoutes);
app.use("/candidate", candidateRoutes);
app.use("/recruiter/applications", recruiterApplicationRoutes);
app.use("/recruiter", recruiterProfileRoutes);
app.use("/recruiter/candidates", recruiterCandidateRoutes);

app.get("/health", (req, res) => {
    logger.info("Health check OK");
    res.status(200).json({ status: "OK" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
