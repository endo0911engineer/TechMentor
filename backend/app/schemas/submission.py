from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class InterviewContentItem(BaseModel):
    checked: bool = False
    comment: Optional[str] = None


class InterviewContent(BaseModel):
    coding: InterviewContentItem = InterviewContentItem()
    system_design: InterviewContentItem = InterviewContentItem()
    behavioral: InterviewContentItem = InterviewContentItem()
    case: InterviewContentItem = InterviewContentItem()
    english: InterviewContentItem = InterviewContentItem()
    other: InterviewContentItem = InterviewContentItem()


class SalarySubmissionCreate(BaseModel):
    company_id: int
    job_title: Optional[str] = Field(None, max_length=100)
    years_of_experience: int = Field(ge=0, le=50)
    salary: int = Field(ge=100, le=10000)
    salary_breakdown: Optional[str] = Field(None, max_length=200)
    location: Optional[str] = Field(None, max_length=100)
    remote_type: Optional[str] = Field(None, max_length=100)
    overtime_feeling: Optional[str] = Field(None, max_length=100)
    tech_stack: Optional[str] = Field(None, max_length=500)
    comment: Optional[str] = Field(None, max_length=1000)
    recaptcha_token: Optional[str] = None  # 検証後に除外、DBには保存しない


class SalarySubmissionRead(BaseModel):
    id: int
    company_id: int
    job_title: Optional[str] = None
    years_of_experience: Optional[int] = None
    salary: Optional[int] = None
    salary_breakdown: Optional[str] = None
    location: Optional[str] = None
    remote_type: Optional[str] = None
    overtime_feeling: Optional[str] = None
    tech_stack: Optional[str] = None
    comment: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class InterviewSubmissionCreate(BaseModel):
    company_id: int
    job_title: Optional[str] = Field(None, max_length=100)
    employment_type: Optional[str] = Field(None, max_length=50)  # 新卒/中途
    interview_rounds: int = Field(ge=1, le=20)
    result: Optional[str] = Field(None, max_length=50)
    difficulty: Optional[str] = Field(None, max_length=50)
    tags: Optional[str] = Field(None, max_length=200)
    interview_content: Optional[str] = Field(None, max_length=5000)  # JSON string
    recaptcha_token: Optional[str] = None  # 検証後に除外、DBには保存しない


class InterviewSubmissionRead(BaseModel):
    id: int
    company_id: int
    job_title: Optional[str] = None
    employment_type: Optional[str] = None  # 新卒/中途
    interview_rounds: Optional[int] = None
    result: Optional[str] = None
    difficulty: Optional[str] = None
    tags: Optional[str] = None
    interview_content: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class InterviewSubmissionWithCompany(InterviewSubmissionRead):
    company_name: str
