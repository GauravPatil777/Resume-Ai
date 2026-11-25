# 🚀 Resume AI – AI-Powered Resume & Interview Assistant

Resume AI is an AI-powered application designed to help job seekers improve their resumes and prepare for technical interviews. It analyzes job descriptions, evaluates how well a candidate's profile matches the role, identifies skill gaps, and generates personalized interview preparation reports.

The platform also helps candidates create tailored resumes aligned with specific job descriptions.

## ✨ Key Features

### 📊 1. Resume & Job Description Analysis
- Upload your existing resume in PDF format.
- Provide a target job description.
- Analyze the compatibility between your resume and the job requirements.
- Generate an AI-powered resume match score.
- Identify relevant skills and missing qualifications.

### 🎯 2. AI-Powered Interview Preparation
- Generate technical interview questions based on the target role.
- Generate personalized behavioral interview questions.
- Identify technical skill gaps.
- Categorize skill gaps based on severity (High, Medium, Low).
- Generate a structured interview preparation roadmap.

### 📄 3. AI Resume Tailoring
- Generate customized resumes based on specific job descriptions.
- Optimize resume content according to relevant job requirements.
- Highlight relevant skills, experience, and projects.
- Download the generated resume as a PDF.

### ⚡ 4. User-Friendly Interface
- Modern and responsive React interface.
- Interactive interview preparation dashboard.
- Organized presentation of match scores and skill gaps.
- Loading indicators during AI processing.
- Easy resume uploading and PDF downloading.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | CSS |
| Backend | Python, FastAPI |
| AI Integration | LLM APIs, LangChain |
| API Communication | Axios, REST APIs |
| PDF Processing | PyPDF |
| PDF Generation | ReportLab |
| Deployment | Docker, Render |
| Version Control | Git, GitHub |

## 🏗️ Project Architecture

```text
Resume-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Python 3.10+
- Node.js and npm
- Git
- Docker (optional)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Resume_Ai
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables in a `.env` file.

Example:

```env
# Configure your LLM provider API key
GROQ_API_KEY=your_api_key
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend will be available at:

```text
http://localhost:8000
```

FastAPI Swagger documentation:

```text
http://localhost:8000/docs
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

## 🐳 Docker Deployment

The application also supports containerized deployment using Docker.

Build and start the containers:

```bash
docker compose up --build
```

To run containers in detached mode:

```bash
docker compose up -d --build
```

Stop the containers:

```bash
docker compose down
```

## 🔌 API Endpoints

The backend exposes REST API endpoints using FastAPI.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/generate_interview_report` | Generates an AI-powered interview preparation report. |
| POST | `/generate_tailored_resume` | Generates a customized resume in PDF format. |

For complete API documentation, visit the FastAPI Swagger interface at `/docs`.

## 🧠 How It Works

**Step 1: Provide Candidate Information**

Upload your resume (PDF) or provide your personal information.

**Step 2: Enter Job Description**

Paste the job description for the position you want to apply for.

**Step 3: AI Analysis**

The AI analyzes the candidate's profile against the job requirements and evaluates:

- Relevant skills
- Missing skills
- Resume-job compatibility
- Technical strengths and weaknesses

**Step 4: Interview Preparation**

The application generates:

- Resume match score
- Technical interview questions
- Behavioral interview questions
- Skill gap analysis
- Personalized preparation plan

**Step 5: Generate Tailored Resume**

Generate and download a customized PDF resume aligned with your target job description.

## 🔒 Environment Variables

Never commit API keys or sensitive credentials to GitHub.

Keep your environment variables in `.env` files and add them to `.gitignore`.

## 🚀 Future Improvements

- ATS compatibility analysis and optimization.
- Multiple resume templates.
- LinkedIn profile analysis.
- AI-powered mock interview simulation.
- Resume version management.
- Advanced job recommendation system.

## 👨‍💻 Developer

**Gaurav Patil**

B.E. Computer Engineering Student | AI/ML & Full Stack Developer

- GitHub: [GauravPatil777](https://github.com/GauravPatil777)
- LinkedIn: [Gaurav Patil](https://www.linkedin.com/in/gaurav-patil45/)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Built with ❤️ using React, FastAPI, Python, and Generative AI.**