import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function analyzeResumeGemini(resumeText, jobGoal) {
    const prompt = `
Resume Text:
${resumeText}

The candidate wants to be a: ${jobGoal}.

Extract their technical skills, project tech stack, and summarize their experience.
List missing skills needed for the job goal.

Also predict an ATS (Applicant Tracking System) score for this resume, as a percentage from 0 to 100, based on how well it matches the job goal and skill requirements. Be strict and realistic.

Additionally, provide:

- Top 3 strengths or highlights of this resume.
- Main weaknesses or areas for improvement.
- Suggestions for improving the resume to pass ATS filters better.
- Suggested job roles or titles that suit this candidate based on current skills.
- Estimated years of relevant experience.
- Education level or certifications identified (if any).
- Soft skills or leadership qualities apparent from the resume.

Format the result strictly as valid JSON:
{
  "skills": [],
  "projects": [],
  "missing_skills": [],
  "summary": "",
  "ats_score": 0,
  "strengths": [],
  "weaknesses": [],
  "improvement_suggestions": [],
  "recommended_roles": [],
  "years_experience": "",
  "education": "",
  "soft_skills": []
}
`;

    try {
        const response = await axios.post(
            OPENROUTER_ENDPOINT,
            {
                model: "google/gemini-2.5-flash-image-preview:free",
                messages: [
                    { role: "system", content: "You are an expert resume parser and ats score predictor." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.2,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.choices?.[0]?.message?.content?.trim() || "";
    } catch (error) {
        console.error("OpenRouter API error:", error.response?.data || error.message);
        throw new Error("Failed to fetch resume analysis from Mistral via OpenRouter.");
    }
}

export async function analyzeCandidateJobFit(jobDescription, resumeSummary) {
    const prompt = `
Job Description:
${jobDescription}

Candidate Resume Summary:
${resumeSummary}

Based on these, rate the candidate’s fit for this role as a percentage from 0 to 100.
Explain the main reasons for the score.

Respond strictly as JSON:
{
  "fit_score": 0,
  "explanation": ""
}
`;

    const response = await axios.post(
        OPENROUTER_ENDPOINT,
        {
            model: "mistralai/mistral-small-3.2-24b-instruct", // or your chosen model
            messages: [
                { role: "system", content: "You are a recruitment AI assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
        },
        {
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    const aiOutputRaw = response.data.choices?.[0]?.message?.content || "";

    // Remove markdown code blocks if applicable, parse JSON
    let cleaned = aiOutputRaw
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    return JSON.parse(cleaned);
}
