from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Enum, TIMESTAMP, func
from backend.core.database import Base
import enum

class RewardStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    interviewer_id = Column(Integer, ForeignKey("interviewers.id"))
    interview_id = Column(Integer, ForeignKey("interviews.id"))

    amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(Enum(RewardStatus), default=RewardStatus.pending)

    created_at = Column(TIMESTAMP, server_default=func.now())
