// utils/getOrParseResumeText.js
import { downloadFileBuffer } from "./fileDownloader.js";
import { extractTextFromPDF, extractTextFromDocx } from "./fileParser.js";
import User from "../models/User.js"; // or Candidate

export async function getOrParseResumeText(userId) {
    const user = await User.findById(userId);

    // 1. If already cached, use it!
    if (user.resumeText) return user.resumeText;

    // 2. Download file buffer from resume URL
    const fileBuffer = await downloadFileBuffer(user.resume);

    // 3. Extract text based on file type
    let text;
    if (user.resume.endsWith(".pdf")) {
        text = await extractTextFromPDF(fileBuffer);
    } else if (user.resume.endsWith(".docx")) {
        text = await extractTextFromDocx(fileBuffer);
    } else {
        throw new Error("Unsupported file type");
    }

    // 4. Save the text in DB for next time (cache)
    await User.findByIdAndUpdate(userId, { $set: { resumeText: text } });

    return text;
}
