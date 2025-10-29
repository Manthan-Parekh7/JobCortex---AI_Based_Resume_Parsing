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
- View **job roles**  
- Apply to jobs posted by recruiters  

### 🔹 Recruiter Side
- Secure login and dashboard  
- Post jobs with detailed requirements in markdown format  
- Manage candidate applications    

### 🔹 AI Resume Analyzer
Example AI output for a candidate's resume:

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
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### 1. Clone Repository
```bash
git clone https://github.com/Manthan-Parekh7/JobCortex.git
cd JobCortex
```

### 2. Backend Installation
```bash
cd server
npm install
```

### 3. Frontend Installation
```bash
cd client
npm install
```

### 4. Environment Variables Setup

#### Backend (.env file in server folder)
Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/jobcortex
DB_NAME=jobcortex

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (for sending emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Service Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key

# Session Configuration
SESSION_SECRET=your_session_secret_key
```

#### Frontend (.env file in client folder)
Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

### 5. Database Setup

#### Option 1: Restore from Backup (Recommended)
If you have the database backup included in the project:

```bash
# Navigate to project root directory
cd JobCortex

# Restore the database
mongorestore --db jobcortex ./db-backup/jobcortex
```

#### Option 2: Fresh Database Setup
If no backup is available, the application will create the necessary collections automatically when you first run it.

---

## 🏃 Running the Project

### Start Backend Server
```bash
cd server
npm run dev
```
The backend server will start on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

### Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/`

---

## 📁 Project Structure

```
JobCortex/
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── ai/                     # AI clients & resume analysis
│   ├── config/                 # Database & configuration files
│   ├── controllers/            # Business logic controllers
│   ├── middlewares/            # Authentication & validation middlewares
│   ├── models/                 # Mongoose database models
│   ├── routes/                 # API route definitions
│   ├── services/               # Business logic services
│   ├── utils/                  # Utility functions
│   ├── logs/                   # Application logs
│   └── server.js               # Server entry point
│
├── client/                     # Frontend (React.js + Vite)
│   ├── public/                 # Static assets
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React context
│   │   └── assets/             # Images & icons
│   └── index.html              # Main HTML file
│
├── db-backup/                  # MongoDB database backup
└── README.md                   # Project documentation
```

---

## 🛠️ Available Scripts

### Backend Scripts
- `npm run server` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🗄️ Database Information

- **Database**: MongoDB
- **Database Name**: `jobcortex`
- **Collections**: Users, Jobs, Applications, Companies
- **Backup Location**: `./db-backup/jobcortex`

---

## 🔧 Additional Configuration

### MongoDB Setup
1. Install MongoDB on your system
2. Start MongoDB service
3. Create database named `jobcortex`
4. Restore backup using the commands mentioned above

### API Keys Required
- **Google OAuth**: For Google authentication
- **GitHub OAuth**: For GitHub authentication  
- **Cloudinary**: For file upload and storage
- **OpenRouter/Gemini**: For AI-powered resume analysis