import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String },
        logo: { type: String }, // URL or file path
        contactEmail: { type: String, required: true },
        contactPhone: { type: String },
        address: { type: String },
        website: { type: String },
        industry: { type: String },
        size: { type: String }, // e.g., "1-10", "11-50", "51-200"

        // Relation to recruiters
        owners: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // recruiter(s) who manage this company
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // primary creator (main recruiter admin)
            required: true,
        },
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
