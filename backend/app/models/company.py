from sqlalchemy import Column, Integer, String, Text, Boolean
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    industry = Column(String(100))
    employee_count = Column(Integer)
    founded_year = Column(Integer)
    headquarters = Column(String(255))
    tech_stack = Column(Text)
    is_approved = Column(Boolean, default=False, nullable=False, server_default="false")
