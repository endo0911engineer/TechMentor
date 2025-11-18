# app/models/interview.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Enum, String, func
from sqlalchemy.orm import relationship
import enum
from backend.core.database import Base

class InterviewStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    canceled = "canceled"

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    interviewer_id = Column(Integer, ForeignKey("interviewers.id", ondelete="CASCADE"))

    scheduled_at = Column(TIMESTAMP, nullable=False)
    duration_min = Column(Integer, nullable=False)
    status = Column(Enum(InterviewStatus), nullable=False, default=InterviewStatus.scheduled)

    meet_url = Column(String, nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    interviewer = relationship("Interviewer")
