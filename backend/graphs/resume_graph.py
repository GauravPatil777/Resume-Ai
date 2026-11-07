from fastapi import FastAPI,HTTPException,APIRouter
from io import BytesIO
from typing import TypedDict, Optional
from xml.sax.saxutils import escape

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pypdf import PdfReader
from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import START, END, StateGraph
from langchain_core.prompts import PromptTemplate

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    KeepTogether
)
from reportlab.pdfbase.pdfmetrics import stringWidth
from extractResumetext import extract_resume_text_from_bytes

load_dotenv()
# TAILORED RESUME WORKFLOW (NEW)

router = APIRouter()

# GEMINI MODEL

llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    temperature=0.3
)


class ResumeExperience(BaseModel):
    role: str = ""
    company: str = ""
    duration: str = ""
    achievements: list[str] = Field(default_factory=list)


class ResumeProject(BaseModel):
    name: str = ""
    technologies: list[str] = Field(default_factory=list)
    description: list[str] = Field(default_factory=list)


class ResumeEducation(BaseModel):
    degree: str = ""
    institution: str = ""
    duration: str = ""
    details: str = ""


class TailoredResume(BaseModel):
    full_name: str = ""
    contact_info: list[str] = Field(default_factory=list)
    professional_summary: str = ""
    skills: list[str] = Field(default_factory=list)
    experience: list[ResumeExperience] = Field(default_factory=list)
    projects: list[ResumeProject] = Field(default_factory=list)
    education: list[ResumeEducation] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class ResumeState(TypedDict, total=False):
    resume_text: str
    job_description: str
    personal_info: str
    tailored_resume: dict


structured_resume_llm = llm.with_structured_output(TailoredResume)


def generate_tailored_resume_node(state: ResumeState):
    prompt = f"""
    You are an expert resume writer and ATS optimization assistant.
    Create a professional resume tailored to the target job description.

    ORIGINAL RESUME:
    {state.get("resume_text", "")}

    ADDITIONAL CANDIDATE INFORMATION:
    {state.get("personal_info", "")}

    JOB DESCRIPTION:
    {state["job_description"]}

    RULES:
    - Prioritize skills, projects and experience relevant to the role.
    - Improve wording and clarity while preserving the candidate's real meaning.
    - Use relevant job keywords naturally; do not keyword-stuff.
    - Never invent skills, employers, dates, degrees, certifications,
      projects, achievements, metrics or contact details.
    - Do not claim a skill or experience unless supported by the supplied
      candidate information.
    - If a field is unknown, leave it empty.
    - Keep the resume concise, factual and professional.
    """

    response = structured_resume_llm.invoke(prompt)
    return {"tailored_resume": response.model_dump()}


resume_workflow = StateGraph(ResumeState)
resume_workflow.add_node("generate_resume", generate_tailored_resume_node)
resume_workflow.add_edge(START, "generate_resume")
resume_workflow.add_edge("generate_resume", END)
resume_graph = resume_workflow.compile()


def create_tailored_resume(
    resume_text: str,
    job_description: str,
    personal_info: str = ""
) -> TailoredResume:
    result = resume_graph.invoke({
        "resume_text": resume_text,
        "job_description": job_description,
        "personal_info": personal_info
    })
    return TailoredResume.model_validate(result["tailored_resume"])


# RESUME PDF GENERATION (NEW)

def generate_resume_pdf(resume: TailoredResume) -> bytes:

    buffer = BytesIO()

    # DOCUMENT SETTINGS
    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.60 * inch,
        title=f"{resume.full_name or 'Candidate'} - Resume",
        author="Resume AI"
    )

    styles = getSampleStyleSheet()

    # COLORS
    primary = colors.HexColor("#1E3A8A")
    secondary = colors.HexColor("#475569")
    text_color = colors.HexColor("#1F2937")
    line_color = colors.HexColor("#CBD5E1")

    # NAME
    name_style = ParagraphStyle(
        "Name",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=23,
        leading=28,
        alignment=TA_CENTER,
        textColor=primary,
        spaceAfter=6
    )

    # CONTACT
    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        alignment=TA_CENTER,
        textColor=secondary,
        spaceAfter=8
    )

    # PROFESSIONAL SUMMARY
    summary_style = ParagraphStyle(
        "Summary",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.2,
        leading=13,
        textColor=text_color,
        alignment=TA_LEFT,
        spaceAfter=4
    )

    # SECTION HEADING
    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=primary,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    # BODY
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=text_color,
        spaceAfter=3
    )

    # BULLETS
    bullet_style = ParagraphStyle(
        "Bullet",
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-9,
        bulletIndent=0,
        spaceAfter=3
    )

    # STORY
    story = []

    def safe(value):
        return escape(str(value or ""))

    # SECTION HEADING FUNCTION
    def add_heading(title):

        story.append(
            Paragraph(title.upper(), heading_style)
        )

        story.append(
            HRFlowable(
                width="100%",
                thickness=0.8,
                color=line_color,
                spaceAfter=7
            )
        )

    # BULLET FUNCTION
    def add_bullet(value):

        if value:
            story.append(
                Paragraph(
                    f"&#8226;&nbsp;&nbsp;{safe(value)}",
                    bullet_style
                )
            )

    # HEADER
    story.append(
        Paragraph(
            safe(resume.full_name or "Candidate"),
            name_style
        )
    )

    if resume.contact_info:

        contact = " &nbsp; | &nbsp; ".join(
            safe(item) for item in resume.contact_info if item
        )

        story.append(
            Paragraph(contact, contact_style)
        )

    story.append(
        HRFlowable(
            width="100%",
            thickness=1.5,
            color=primary,
            spaceBefore=3,
            spaceAfter=5
        )
    )

    # PROFESSIONAL SUMMARY
    if resume.professional_summary:

        add_heading("Professional Summary")

        story.append(
            Paragraph(
                safe(resume.professional_summary),
                summary_style
            )
        )

    # SKILLS
    if resume.skills:

        add_heading("Technical Skills")

        story.append(
            Paragraph(
                " &nbsp; | &nbsp; ".join(
                    safe(skill) for skill in resume.skills
                ),
                body_style
            )
        )

    # EXPERIENCE
    if resume.experience:

        add_heading("Professional Experience")

        for item in resume.experience:

            title = f"<b>{safe(item.role)}</b>"

            if item.company:
                title += f" &nbsp; | &nbsp; {safe(item.company)}"

            if item.duration:
                title += f" &nbsp; | &nbsp; {safe(item.duration)}"

            section = [
                Paragraph(title, body_style)
            ]

            for achievement in item.achievements:
                if achievement:
                    section.append(
                        Paragraph(
                            f"&#8226;&nbsp;&nbsp;{safe(achievement)}",
                            bullet_style
                        )
                    )

            section.append(Spacer(1, 5))

            story.append(KeepTogether(section))

    # PROJECTS
    if resume.projects:

        add_heading("Projects")

        for project in resume.projects:

            section = [
                Paragraph(
                    f"<b>{safe(project.name)}</b>",
                    body_style
                )
            ]

            if project.technologies:

                section.append(
                    Paragraph(
                        f"<b>Technologies:</b> "
                        f"{safe(', '.join(project.technologies))}",
                        body_style
                    )
                )

            for description in project.description:

                if description:
                    section.append(
                        Paragraph(
                            f"&#8226;&nbsp;&nbsp;{safe(description)}",
                            bullet_style
                        )
                    )

            section.append(Spacer(1, 5))

            story.append(KeepTogether(section))

    # EDUCATION
    if resume.education:

        add_heading("Education")

        for item in resume.education:

            section = [
                Paragraph(
                    f"<b>{safe(item.degree)}</b>",
                    body_style
                )
            ]

            details = " &nbsp; | &nbsp; ".join(
                safe(value)
                for value in [
                    item.institution,
                    item.duration,
                    item.details
                ]
                if value
            )

            if details:
                section.append(
                    Paragraph(details, body_style)
                )

            section.append(Spacer(1, 4))

            story.append(KeepTogether(section))

    # CERTIFICATIONS
    if resume.certifications:

        add_heading("Certifications")

        for certification in resume.certifications:
            add_bullet(certification)

    # PAGE NUMBER FOOTER
    def add_page_number(canvas, doc):

        canvas.saveState()

        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(secondary)

        canvas.drawRightString(
            A4[0] - 0.65 * inch,
            0.32 * inch,
            f"Page {doc.page}"
        )

        canvas.restoreState()

    # BUILD PDF
    document.build(
        story,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number
    )

    buffer.seek(0)

    return buffer.getvalue()