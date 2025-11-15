from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from enum import Enum


class RewardStatus(str, Enum):
    pending = "pending"
    paid = "paid"


class RewardBase(BaseModel):
    interviewer_id: int
    interview_id: int
    amount: Decimal
    status: RewardStatus = RewardStatus.pending


class RewardCreate(RewardBase):
    pass


class RewardResponse(RewardBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
