from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal

InterviewStatus = Literal["scheduled", "completed", "canceled"]

class InterviewCreate(BaseModel):
    slot_id: int

class InterviewResponse(BaseModel):
    id: int
    user_id: int
    interviewer_id: int
    scheduled_at: datetime
    duration_min: int
    status: InterviewStatus
    meet_url: Optional[str] = None

    model_config = {"from_attributes": True}
