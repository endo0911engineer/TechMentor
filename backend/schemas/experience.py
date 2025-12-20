from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExperienceBase(BaseModel):
    company: str
    title: str
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None

class ExperienceResponse(ExperienceBase):
    id: int

    model_config = {"from_attributes": True}
