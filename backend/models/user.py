# app/models/user.py
from sqlalchemy import Column, Integer, String, Enum, JSON, TIMESTAMP, func
from sqlalchemy.orm import relationship
from backend.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    
    role = Column(Enum("user", "interviewer", "admin", name="user_role"), default="user")
    
    profile = Column(JSON)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    interviewer_profile = relationship("Interviewer", back_populates="user", uselist=False)