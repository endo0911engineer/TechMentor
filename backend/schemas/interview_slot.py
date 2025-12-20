from pydantic import BaseModel
from datetime import datetime

class InterviewSlotCreate(BaseModel):
    start_at: datetime
    end_at: datetime

class InterviewSlotResponse(BaseModel):
    id: int
    start_at: datetime
    end_at: datetime
    is_available: bool

    model_config = {"from_attributes": True}
