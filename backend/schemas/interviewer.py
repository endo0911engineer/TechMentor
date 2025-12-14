from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

class InterviewerBase(BaseModel):
    profile: Optional[dict] = None
    hourly_rate: Optional[Decimal] = None

class InterviewerCreate(InterviewerBase):
    user_id: int

class InterviewerResponse(InterviewerBase):
    id: int
    user_id: int

    model_config = {"from_attributes": True}
