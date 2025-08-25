import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import * as companyController from "../controllers/companyController.js";
import { isVerified } from "../middlewares/isVerifiedMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, isRecruiter, isVerified, companyController.createCompany);
router.get("/me", isAuthenticated, isRecruiter, isVerified, companyController.getMyCompany);
router.put("/me", isAuthenticated, isRecruiter, isVerified, companyController.updateCompany);

export default router;
