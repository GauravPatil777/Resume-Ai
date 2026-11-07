from io import BytesIO

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pypdf import PdfReader
load_dotenv()

# SHARED PDF TEXT EXTRACTION

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_PAGES = 20

def extract_resume_text_from_bytes(content: bytes) -> str:
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded resume is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Resume must be smaller than 5 MB."
        )

    if not content.startswith(b"%PDF-"):
        raise HTTPException(status_code=400, detail="Invalid PDF file.")

    try:
        pdf = PdfReader(BytesIO(content))

        if pdf.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Password-protected PDFs are not supported."
            )

        if len(pdf.pages) > MAX_PAGES:
            raise HTTPException(
                status_code=400,
                detail="Resume PDF cannot exceed 20 pages."
            )

        text = "\n".join(page.extract_text() or "" for page in pdf.pages)

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text. Please upload a text-based PDF."
            )

        return text

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted PDF file."
        )

def extract_resume_text(file: UploadFile) -> str:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    return extract_resume_text_from_bytes(file.file.read())