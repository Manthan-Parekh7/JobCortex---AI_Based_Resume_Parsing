import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Resumes
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobportal_resumes",
        resource_type: "raw",
        allowed_formats: ["pdf", "doc", "docx", "txt"],
        public_id: (req, file) => `resume-${req.user.id}-${Date.now()}`,
    },
});

const uploadResume = multer({ storage: resumeStorage });

// Storage for Profile Images
const profileImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobportal_profile_images",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: (req, file) => `profile-${req.user.id}-${Date.now()}`,
    },
});

const uploadProfileImage = multer({ storage: profileImageStorage });

export { cloudinary, uploadResume, uploadProfileImage };
