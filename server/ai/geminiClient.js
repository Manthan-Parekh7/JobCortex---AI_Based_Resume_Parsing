import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper for LLM chat
export async function analyzeResumeGemini(resumeText, jobGoal) {
    const prompt = `
Resume Text:
${resumeText}

The candidate wants to be a: ${jobGoal}.
Extract their technical skills, project tech stack, and summarize their experience.
List missing skills needed for the jobGoal.
Format the result strictly as valid JSON:
{
  "skills": [],
  "projects": [],
  "missing_skills": [],
  "summary": ""
}
`;

    // The Gemini API's interface is similar to OpenAI, but always check their docs for the latest
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);

    // Gemini API v1 response:
    return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.text || "";
}
