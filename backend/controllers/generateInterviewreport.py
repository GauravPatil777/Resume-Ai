from fastapi import APIRouter, HTTPException
from typing import TypedDict, Optional
from dotenv import load_dotenv
from fastapi import UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import START, END, StateGraph
from langchain_core.prompts import PromptTemplate
from extractResumetext import extract_resume_text
from graphs.report_graph import workflow
from graphs.report_graph import InterviewReport

load_dotenv()


router = APIRouter()


@router.post(
    "/generate_interview_report",
    response_model=InterviewReport
)
def generate_interview_report(
    role_description: str = Form(...),
    personal_info: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None)
):
    if not role_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    personal_info = personal_info.strip() if personal_info else None

    if not personal_info and not resume:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume or enter your self-description."
        )

    if resume:
        resume_text = extract_resume_text(resume)
        candidate_info = f"""
        RESUME INFORMATION:
        {resume_text}

        ADDITIONAL CANDIDATE INFORMATION:
        {personal_info or "Not provided"}
        """
    else:
        candidate_info = personal_info

    try:
        result = workflow.invoke({
            "role_description": role_description,
            "personal_info": candidate_info
        })
        return result

    except Exception as error:
        print("Interview Report Error:", str(error))
        raise HTTPException(
            status_code=500,
            detail="Failed to generate interview report. Please try again."
        )

