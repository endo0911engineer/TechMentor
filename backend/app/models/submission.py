from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class SalarySubmission(Base):
    __tablename__ = "salary_submissions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    job_title = Column(String(255))
    years_of_experience = Column(Integer)
    salary = Column(Integer)           # 年収合計（万円）
    salary_breakdown = Column(Text)    # 年収内訳（任意）
    location = Column(String(255))
    remote_type = Column(String(100))  # フルリモート/一部リモート/出社のみ
    overtime_feeling = Column(String(100))  # 残業感
    tech_stack = Column(Text)              # カンマ区切り技術スタック
    comment = Column(Text)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class InterviewSubmission(Base):
    __tablename__ = "interview_submissions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    job_title = Column(String(255))
    interview_rounds = Column(Integer)
    result = Column(String(50))        # 合格/不合格/辞退/選考中
    difficulty = Column(String(50))    # とても簡単〜とても難しい
    employment_type = Column(String(50))   # 新卒/中途
    tags = Column(Text)                # カンマ区切りタグ
    # 面接内容: JSON {"coding":{"checked":true,"comment":"..."}, ...}
    interview_content = Column(Text)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
