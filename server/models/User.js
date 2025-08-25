import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // only required for local auth
        provider: {
            type: String,
            enum: ["local", "google", "github"],
            default: "local",
        },
        googleId: { type: String },
        githubId: { type: String },
        image: { type: String }, // profile picture
        resume: { type: String }, // for candidates
        resumePublicId: { type: String },
        // NEW fields
        role: {
            type: String,
            enum: ["candidate", "recruiter", "admin"],
            default: "candidate",
        },
        companyName: { type: String }, // for recruiters
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // future use

        isVerified: { type: Boolean, default: false },
        refreshToken: { type: String, default: null },

        otp: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
