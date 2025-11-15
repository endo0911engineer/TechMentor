# app/models/schedule.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func
from backend.core.database import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    interviewer_id = Column(Integer, ForeignKey("interviewers.id"))
    available_from = Column(TIMESTAMP, nullable=False)
    available_to = Column(TIMESTAMP, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
