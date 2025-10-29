import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import * as companyController from "../controllers/companyController.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";

const router = express.Router();

// Create new company (original route)
router.post("/", isAuthenticated, isRecruiter, isVerified, companyController.createCompany);

// Create or update company profile (new upsert route)
router.post("/profile", isAuthenticated, isRecruiter, isVerified, companyController.createOrUpdateCompany);

// Get company profile
router.get("/me", isAuthenticated, isRecruiter, isVerified, companyController.getMyCompany);

// Update existing company
router.put("/me", isAuthenticated, isRecruiter, isVerified, companyController.updateCompany);

export default router;
