# app/models/user_profile.py
from sqlalchemy import Column, Integer, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.core.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    experience_years = Column(Integer, nullable=False)

    english_level = Column(
        Enum("none", "basic", "business", "fluent", name="english_level"),
        nullable=False
    )

    target_level = Column(
        Enum("junior", "mid", "senior", "staff", "principal", name="target_level"),
        nullable=False
    )

    interview_weaknesses = Column(Text)

    user = relationship("User", back_populates="profile")
    skills = relationship("UserSkill", back_populates="profile")
