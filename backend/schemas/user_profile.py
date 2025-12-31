from pydantic import BaseModel
from typing import Optional, Literal

EnglishLevel = Literal["beginner", "intermediate", "advanced", "native"]
TargetLevel = Literal["junior", "mid", "senior", "staff", "principal"]

class UserProfileBase(BaseModel):
    skills: list[str] = []
    experience_years: int | None = None
    english_level: EnglishLevel | None = None
    target_level: TargetLevel | None = None
    interview_weaknesses: str | None = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(BaseModel):
    skills: Optional[list[str]] = None
    experience_years: Optional[int] = None
    english_level: Optional[EnglishLevel] = None
    target_level: Optional[TargetLevel] = None

class UserProfileResponse(UserProfileBase):
    pass
