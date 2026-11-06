from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.generateInterviewreport  import router as interview_router
from controllers.generateResume  import router as resume_router
load_dotenv()

app = FastAPI(title="Resume AI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
        return {"message": "Resume AI Backend is running!"}
    
app.include_router(interview_router)
app.include_router(resume_router)

