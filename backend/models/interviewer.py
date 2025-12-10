# app/models/interviewer.py
from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, JSON
from backend.core.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

class Interviewer(Base):
    __tablename__ = "interviewers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)

    profile = Column(JSON)
    hourly_rate = Column(DECIMAL(10, 2), nullable=False)

    user = relationship("User", back_populates="interviewer_profile")