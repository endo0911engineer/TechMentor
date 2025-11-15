# app/models/feedback.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, TEXT, func
from backend.core.database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"))
    score = Column(Integer, nullable=False)
    comment = Column(TEXT)
    created_at = Column(TIMESTAMP, server_default=func.now())
