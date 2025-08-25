import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobportal_resumes",
        resource_type: "raw",
        allowed_formats: ["pdf", "doc", "docx", "txt"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const uploadResume = multer({ storage });

export { cloudinary, uploadResume };
