# app/models/user_profile.py
from sqlalchemy import Column, Integer, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.core.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    experience_years = Column(Integer, nullable=True)

    english_level = Column(
        Enum("none", "basic", "business", "fluent", name="english_level"),
        nullable=True,
    )

    target_level = Column(
        Enum("junior", "mid", "senior", "staff", "principal", name="target_level"),
        nullable=True,
    )

    interview_weaknesses = Column(Text, nullable=True)

    user = relationship("User", back_populates="user_profile")
    skills = relationship("UserSkill", back_populates="profile", cascade="all, delete-orphan")
