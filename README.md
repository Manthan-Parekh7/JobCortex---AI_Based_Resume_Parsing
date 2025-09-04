# JobCortex

JobCortex is a **full-stack job portal** designed to streamline the **candidate–recruiter workflow** while leveraging **AI-based resume analysis**.  
Candidates can upload their resumes, receive **AI-driven insights on skill gaps**, and obtain suggestions for improvement. Recruiters can post jobs, manage applications, and evaluate candidates efficiently.  

The system aims to bridge the gap between **job seekers** and **employers**, while also guiding candidates to improve their resumes for better **ATS (Applicant Tracking System) scores** and career growth.

---

## ✨ Features

### 🔹 Candidate Side
- Register/login using **email/password** or **OAuth (Google/GitHub)**  
- Upload resumes in PDF/DOC formats  
- **AI-powered resume scan**:  
  - Extracts **skills, projects, education, experience**  
  - Identifies **missing skills**  
  - Provides an **ATS score**  
  - Gives **improvement suggestions**  
- View **recommended job roles**  
- Apply to jobs posted by recruiters  

### 🔹 Recruiter Side
- Secure login and dashboard  
- Post jobs with detailed requirements  
- Manage candidate applications  
- Shortlist candidates using ATS insights  

### 🔹 AI Resume Analyzer
Example AI output for a candidate’s resume:

```json
{
  "skills": ["Java", "Python", "Node.js", "React", "MongoDB"],
  "missing_skills": ["TensorFlow", "AWS", "Docker"],
  "ats_score": 75,
  "strengths": ["Full-stack experience", "Machine learning projects"],
  "weaknesses": ["No cloud experience"],
  "improvement_suggestions": ["Add certifications", "Improve ATS formatting"],
  "recommended_roles": ["Software Engineer", "Full-Stack Developer"]
}



JobCortex/
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── ai/                     # AI clients & resume analysis
│   │   └── openrouterClient.js
│   ├── config/                 # Config files (DB, env, etc.)
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   └── recruiterApplicationController.js
│   ├── logs/                   # Logging
│   ├── middlewares/            # Authentication, validation, error handling
│   ├── models/                 # Mongoose models
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   └── User.js
│   ├── routes/                 # Express routes
│   │   ├── authRoutes.js
│   │   ├── candidateRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   └── recruiterApplicationRoutes.js
│   ├── services/               # Services (business logic helpers)
│   ├── test/                   # Testing utilities
│   │   └── data/
│   ├── utils/                  # Utility functions
│   │   ├── emailService.js
│   │   ├── fileDownloader.js
│   │   ├── fileParser.js
│   │   └── passport.js
│   └── app.js / server.js      # Entry point
│
└── client/                     # Frontend (React.js - to be added)
    ├── public/
    └── src/


