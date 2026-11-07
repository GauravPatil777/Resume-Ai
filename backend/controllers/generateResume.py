from fastapi import HTTPException,APIRouter
from io import BytesIO
from typing import Optional
from dotenv import load_dotenv
from fastapi import UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from extractResumetext import extract_resume_text_from_bytes
from graphs.resume_graph import create_tailored_resume, generate_resume_pdf

load_dotenv()
# TAILORED RESUME WORKFLOW (NEW)

router = APIRouter()


# NEW: TAILORED RESUME PDF API

@router.post("/generate_tailored_resume")
async def generate_tailored_resume_endpoint(
    role_description: str = Form(...),
    personal_info: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None)
):
    if not role_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    personal_info = personal_info.strip() if personal_info else ""

    if not personal_info and not resume:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume or enter your self-description."
        )

    resume_text = ""

    if resume:
        if not resume.filename or not resume.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF resumes are supported."
            )

        file_content = await resume.read()
        resume_text = extract_resume_text_from_bytes(file_content)

    try:
        tailored_resume = create_tailored_resume(
            resume_text=resume_text,
            job_description=role_description,
            personal_info=personal_info
        )

        pdf_content = generate_resume_pdf(tailored_resume)

        return StreamingResponse(
            BytesIO(pdf_content),
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                    'attachment; filename="tailored_resume.pdf"'
            }
        )

    except HTTPException:
        raise
    except Exception as error:
        print("Tailored Resume Generation Error:", str(error))
        raise HTTPException(
            status_code=500,
            detail="Failed to generate tailored resume. Please try again."
        )
