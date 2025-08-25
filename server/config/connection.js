import mongoose from "mongoose";
// import logger from "./logger.js"; // Assuming you have a logger

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobportal";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // logger.info("MongoDB connected successfully 🎉");
    } catch (error) {
        // logger.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
