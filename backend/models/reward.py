from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Enum, TIMESTAMP, func
from sqlalchemy.orm import relationship
from backend.core.database import Base
import enum


class RewardStatus(str, enum.Enum):
    pending = "pending"   # 支払待ち
    paid = "paid"         # 支払済
    canceled = "canceled" # 面接キャンセル等

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True)

    # 支払対象の面接
    interview_id = Column(
        Integer,
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,  
    )

    # 面接官（users.id）
    interviewer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    amount = Column(DECIMAL(10, 2), nullable=False)

    status = Column(Enum(RewardStatus), nullable=False, default=RewardStatus.pending)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    interview = relationship("Interview", back_populates="reward")
    interviewer = relationship("User")
