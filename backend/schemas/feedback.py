from pydantic import BaseModel
from datetime import datetime


class FeedbackBase(BaseModel):
    interview_id: int
    score: int
    comment: str | None = None


class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseModel):
    score: int | None = None
    comment: str | None = None


class FeedbackResponse(FeedbackBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
