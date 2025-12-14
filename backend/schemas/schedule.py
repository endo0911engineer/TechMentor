from pydantic import BaseModel
from datetime import datetime


class ScheduleBase(BaseModel):
    available_from: datetime
    available_to: datetime


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleResponse(ScheduleBase):
    id: int
    interviewer_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
