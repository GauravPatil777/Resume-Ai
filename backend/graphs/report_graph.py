from fastapi import APIRouter, HTTPException
from typing import TypedDict, Optional
from dotenv import load_dotenv
from fastapi import UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import START, END, StateGraph
from langchain_core.prompts import PromptTemplate
from extractResumetext import extract_resume_text

load_dotenv()


router = APIRouter()

# GEMINI MODEL

llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    temperature=0.3
)

class InterviewReport(BaseModel):
    matchedScore: float = Field(
        description="Candidate's job role matching score between 0 and 100"
    )
    technicalQuestions: dict[str, str] = Field(
        description="Technical interview questions with suggested answers"
    )
    behavioralQuestions: dict[str, str] = Field(
        description="Behavioral interview questions with suggested answers"
    )
    skillGap: dict[str, str] = Field(
        description="Identified skill gaps with severity: high, medium, low"
    )
    preparationPlan: dict[str, str] = Field(
        description="Actionable preparation plans for identified skill gaps"
    )


class InterviewState(TypedDict, total=False):
    role_description: str
    personal_info: str
    matchedScore: float
    technicalQuestions: dict[str, str]
    behavioralQuestions: dict[str, str]
    skillGap: dict[str, str]
    preparationPlan: dict[str, str]


structured_llm = llm.with_structured_output(InterviewReport)


def interviewReport(state: InterviewState):
    prompt = PromptTemplate(
        template="""
        You are an expert technical recruiter and career coach.

        Analyze the candidate's information against the given job description.
        Generate a personalized interview preparation report.

        1. MATCHED SCORE:
           - Generate a score between 0 and 100.
           - Evaluate technical skills, education, projects and experience.
           - Consider the importance of each job requirement.
           - Do not give a high score just because keywords match.
           - Do not penalize candidates for experience they were not expected to have.

        2. TECHNICAL QUESTIONS:
           - Generate 10 relevant technical interview questions.
           - Provide clear and accurate suggested answers.
           - Focus on technologies required for the role.
           - Include questions appropriate for the candidate's experience level.

        3. BEHAVIORAL QUESTIONS:
           - Generate 5 relevant behavioral interview questions.
           - Provide personalized suggested answers based on the candidate's background.
           - Do not invent achievements or work experience.

        4. SKILL GAP ANALYSIS:
           - Identify missing or weak skills by comparing the candidate's profile
             with the job requirements.
           - Categorize each skill gap as high, medium or low.
           - Do not assume a skill is missing just because it is not mentioned.
           - Distinguish between confirmed gaps and skills with insufficient evidence.

        5. PREPARATION PLAN:
           - Provide actionable preparation steps for each identified skill gap.
           - Include relevant topics, technologies and concepts to study.
           - Keep the recommendations practical.

        Keep the report personalized, realistic and suitable for the candidate's
        experience level.

        JOB DESCRIPTION:
        {role_description}

        CANDIDATE INFORMATION:
        {personal_info}
        """,
        input_variables=["role_description", "personal_info"]
    )

    response = structured_llm.invoke(
        prompt.format(
            role_description=state["role_description"],
            personal_info=state["personal_info"]
        )
    )

    result = response.model_dump()
    result["matchedScore"] = max(0, min(100, result["matchedScore"]))
    return result


interview_workflow = StateGraph(InterviewState)
interview_workflow.add_node("interviewReport", interviewReport)
interview_workflow.add_edge(START, "interviewReport")
interview_workflow.add_edge("interviewReport", END)
workflow = interview_workflow.compile()