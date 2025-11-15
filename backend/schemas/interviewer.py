from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime
from decimal import Decimal

class InterviewerBase(BaseModel):
    name: str
    email: EmailStr
    profile: Optional[Any] = None
    hourly_rate: Decimal

class InterviewerCreate(InterviewerBase):
    password: str

class InterviewerResponse(InterviewerBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
