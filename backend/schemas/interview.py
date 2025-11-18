from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class InterviewStatus(str, Enum):
    scheduled = "scheduled"
    completed = "completed"
    canceled = "canceled"


class InterviewBase(BaseModel):
    interviewer_id: int
    scheduled_at: datetime
    duration_min: int
    status: InterviewStatus = InterviewStatus.scheduled
    meet_url: str | None = None

class InterviewCreate(InterviewBase):
    interviewer_id: int
    scheduled_at: datetime
    duration_min: int


class InterviewResponse(InterviewBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class InterviewStatusUpdate(BaseModel):
    status: InterviewStatus

