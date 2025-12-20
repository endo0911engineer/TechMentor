# app/models/interviewer.py
from sqlalchemy import Column, Integer, ForeignKey, String, Enum, Text
from backend.core.database import Base
from sqlalchemy.orm import relationship

class InterviewerProfile(Base):
    __tablename__ = "interviewer_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    current_company = Column(String)
    current_title = Column(String)

    years_of_interviewing = Column(Integer)

    interview_style = Column(
        Enum("strict", "friendly", "realistic", name="interview_style")
    )

    strengths = Column(Text)  
    bio = Column(Text)

    price_per_session = Column(Integer) 

    available_levels = Column(
        Enum("junior", "mid", "senior", "staff", "principal", name="available_level")
    )

    user = relationship("User", back_populates="interviewer_profile")