# app/models/interview.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func, Boolean
from sqlalchemy.orm import relationship
from backend.core.database import Base

class InterviewSlot(Base):
    __tablename__ = "interview_slots"

    id = Column(Integer, primary_key=True)

    interviewer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    start_at = Column(TIMESTAMP(timezone=True), nullable=False)
    end_at = Column(TIMESTAMP(timezone=True), nullable=False)

    is_available = Column(Boolean, default=True)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    interviewer = relationship(
        "User",
        backref="interview_slots"
    )
