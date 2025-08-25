import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        responsibilities: { type: String },
        requirements: { type: String },
        salary: { type: String }, // could be a range or object, for now string
        location: { type: String },
        jobType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship"], default: "Full-time" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isVisible: { type: Boolean, default: true },

        // Link to company & recruiter
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
