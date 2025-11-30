from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

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

class PaymentUpdate(BaseModel):
    """
    決済情報を更新するためのスキーマ。
    更新対象のフィールドは全て Optional (任意) とします。
    """
    user_id: Optional[int] = None
    interview_id: Optional[int] = None
    amount: Optional[Decimal] = None
    status: Optional[PaymentStatus] = None 
    payment_method: Optional[str] = None


class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
