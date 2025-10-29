import mongoose from "mongoose";
import Job from "./Job.js";
import Application from "./Application.js";

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

// Cascade delete jobs and applications when a company is deleted
companySchema.post("findOneAndDelete", async function (doc) {
    if (!doc) return;
    try {
        const jobs = await Job.find({ company: doc._id }).select("_id");
        const jobIds = jobs.map((j) => j._id);
        await Promise.all([Job.deleteMany({ company: doc._id }), Application.deleteMany({ job: { $in: jobIds } })]);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Cascade delete jobs/applications failed for company:", doc._id, err?.message);
    }
});

// Support document deleteOne() cascades
companySchema.post("deleteOne", { document: true, query: false }, async function () {
    try {
        const jobs = await Job.find({ company: this._id }).select("_id");
        const jobIds = jobs.map((j) => j._id);
        await Promise.all([Job.deleteMany({ company: this._id }), Application.deleteMany({ job: { $in: jobIds } })]);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Cascade delete jobs/applications failed for company (doc.deleteOne):", this?._id, err?.message);
    }
});
