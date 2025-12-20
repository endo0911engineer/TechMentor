# app/models/interview.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Enum, String, func, Text
from sqlalchemy.orm import relationship
import enum
from backend.core.database import Base

class InterviewStatus(str, enum.Enum):
    scheduled = "scheduled"      # 予約確定
    completed = "completed"      # 実施完了
    canceled = "canceled"        # キャンセル
    no_show = "no_show"          # どちらか不参加

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    interviewer_id = Column(Integer, ForeignKey("interviewers.id", ondelete="CASCADE"))

    scheduled_at = Column(TIMESTAMP, nullable=False)
    duration_min = Column(Integer, nullable=False)
    
    status = Column(Enum(InterviewStatus), nullable=False, default=InterviewStatus.scheduled)

    meet_url = Column(String, nullable=True)

    # 面接後
    feedback = Column(Text)
    rating = Column(Integer)  # 1〜5

    # 管理系
    canceled_by_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    canceled_at = Column(TIMESTAMP(timezone=True))
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id], backref="interviews_as_user")
    interviewer = relationship("Interviewer", foreign_keys=[interviewer_id], backref="interviews_as_interviewer")

    canceled_by = relationship(
        "User",
        foreign_keys=[canceled_by_user_id]
    )
