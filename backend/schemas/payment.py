from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from enum import Enum

class PaymentStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"


class PaymentBase(BaseModel):
    user_id: int
    interview_id: int
    amount: Decimal
    status: PaymentStatus = PaymentStatus.pending
    payment_method: str | None = None


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
