from pydantic import BaseModel
from typing import Optional, Literal

InterviewStyle = Literal["strict", "friendly", "realistic"]
Level = Literal["junior", "mid", "senior", "staff", "principal"]

class InterviewerProfileBase(BaseModel):
    interview_style: InterviewStyle
    strengths: list[str]
    available_levels: list[Level]

class InterviewerProfileCreate(InterviewerProfileBase):
    pass

class InterviewerProfileUpdate(BaseModel):
    interview_style: Optional[InterviewStyle] = None
    strengths: Optional[list[str]] = None
    available_levels: Optional[list[Level]] = None
    bio: Optional[str] = None
    current_company: Optional[str] = None
    current_title: Optional[str] = None
    years_of_interviewing: Optional[int] = None

class InterviewerProfileResponse(InterviewerProfileBase):
    bio: Optional[str] = None
