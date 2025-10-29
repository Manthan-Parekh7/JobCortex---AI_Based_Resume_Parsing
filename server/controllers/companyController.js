import Company from "../models/Company.js";
import User from "../models/User.js";
import logger from "../config/logger.js";

// Create Company (Recruiter only) - Original function
export const createCompany = async (req, res) => {
    try {
        const { name, description, logo, contactEmail, contactPhone, address, website, industry, size } = req.body;

        if (req.user.role !== "recruiter") {
            logger.warn(`User ${req.user.email} with role ${req.user.role} attempted to create company - forbidden`);
            return res.status(403).json({ success: false, message: "Only recruiters can create companies" });
        }

        // Prevent multiple companies per recruiter (optional rule)
        if (req.user.companyId) {
            logger.warn(`Recruiter ${req.user.email} already belongs to a company (ID: ${req.user.companyId})`);
            return res.status(400).json({ success: false, message: "Recruiter already belongs to a company" });
        }

        const company = await Company.create({
            name,
            description,
            logo,
            contactEmail,
            contactPhone,
            address,
            website,
            industry,
            size,
            owners: [req.user._id],
            createdBy: req.user._id,
        });

        // Link recruiter to the company
        req.user.companyId = company._id;
        await req.user.save();

        logger.info(`Company created (ID: ${company._id}) by recruiter ${req.user.email}`);
        return res.status(201).json({ success: true, message: "Company created", company });
    } catch (err) {
        logger.error("Create company error:", err);
        return res.status(500).json({ success: false, message: "Failed to create company" });
    }
};

// Create or Update Company Profile (upsert functionality)
export const createOrUpdateCompany = async (req, res) => {
    try {
        const { name, description, logo, contactEmail, contactPhone, address, website, industry, size } = req.body;

        if (req.user.role !== "recruiter") {
            logger.warn(`User ${req.user.email} with role ${req.user.role} attempted to create/update company - forbidden`);
            return res.status(403).json({ success: false, message: "Only recruiters can create companies" });
        }

        // Validate required fields
        if (!name || !contactEmail) {
            return res.status(400).json({
                success: false,
                message: "Company name and contact email are required",
            });
        }

        // Check if user already has a company
        if (req.user.companyId) {
            // Update existing company
            const company = await Company.findById(req.user.companyId);
            if (!company) {
                logger.warn(`Company not found for user ${req.user.email} (Company ID: ${req.user.companyId})`);
                return res.status(404).json({ success: false, message: "Company not found" });
            }

            // Check if the user is an owner
            if (!company.owners.includes(req.user._id)) {
                logger.warn(`User ${req.user.email} attempted to update company ${company._id} without ownership`);
                return res.status(403).json({ success: false, message: "Not authorized to update this company" });
            }

            // Update company fields
            Object.assign(company, {
                name: name || company.name,
                description,
                logo,
                contactEmail: contactEmail || company.contactEmail,
                contactPhone,
                address,
                website,
                industry,
                size,
            });

            await company.save();
            logger.info(`Company ${company._id} updated by user ${req.user.email}`);
            return res.json({ success: true, message: "Company updated successfully", company });
        } else {
            // Create new company
            const company = await Company.create({
                name,
                description,
                logo,
                contactEmail,
                contactPhone,
                address,
                website,
                industry,
                size,
                owners: [req.user._id],
                createdBy: req.user._id,
            });

            // Link recruiter to the company
            await User.findByIdAndUpdate(req.user._id, { companyId: company._id });

            logger.info(`Company created (ID: ${company._id}) by recruiter ${req.user.email}`);
            return res.status(201).json({ success: true, message: "Company created successfully", company });
        }
    } catch (err) {
        logger.error("Create or update company error:", err);
        return res.status(500).json({ success: false, message: "Failed to create or update company" });
    }
}; // Get Company Profile for logged-in recruiter
export const getMyCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.user.companyId).populate("owners", "username email role");
        if (!company) {
            logger.warn(`No company found for user ${req.user.email}`);
            return res.status(404).json({ success: false, message: "No company found for this user" });
        }
        logger.info(`Company profile fetched for user ${req.user.email} (Company ID: ${req.user.companyId})`);
        return res.json({ success: true, message: "Company profile fetched", company });
    } catch (err) {
        logger.error("Failed to fetch company:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch company" });
    }
};

// Update Company (Recruiter must be owner)
export const updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.user.companyId);
        if (!company) {
            logger.warn(`Company not found for user ${req.user.email} (Company ID: ${req.user.companyId})`);
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // Check if the user is an owner
        if (!company.owners.includes(req.user._id)) {
            logger.warn(`User ${req.user.email} attempted to update company ${company._id} without ownership`);
            return res.status(403).json({ success: false, message: "Not authorized to update this company" });
        }

        Object.assign(company, req.body);
        await company.save();

        logger.info(`Company ${company._id} updated by user ${req.user.email}`);
        return res.json({ success: true, message: "Company updated", company });
    } catch (err) {
        logger.error("Failed to update company:", err);
        return res.status(500).json({ success: false, message: "Failed to update company" });
    }
};
