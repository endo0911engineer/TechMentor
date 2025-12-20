# app/crud/interview.py
from sqlalchemy.orm import Session
from backend.models.interview import Interview, InterviewStatus
from backend.schemas.interview import InterviewCreate
from typing import List
from backend.service.meet import generate_meet_url


def get_interview(db: Session, interview_id: int) -> Interview | None:
    return db.query(Interview).filter(Interview.id == interview_id).first()

def get_interviews(db: Session, skip: int = 0, limit: int = 100) -> List[Interview]:
    return db.query(Interview).offset(skip).limit(limit).all()

def create_interview(db: Session, user_id: int, interview_in: InterviewCreate) -> Interview:
    meet_url = generate_meet_url()

    db_interview = Interview(
        user_id=user_id,
        interviewer_id=interview_in.interviewer_id,
        scheduled_at=interview_in.scheduled_at,
        duration_min=interview_in.duration_min,
        status=InterviewStatus.scheduled,
        meet_url=meet_url
    )

    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

# ------------------------------------------------------------
# 面接ステータス更新（/status）
# ------------------------------------------------------------
def update_interview_status(
    db: Session,
    db_interview: Interview,
    new_status: InterviewStatus
) -> Interview:
    db_interview.status = new_status
    db.commit()
    db.refresh(db_interview)
    return db_interview

  
def update_interview(db: Session, db_interview: Interview, update_data: dict) -> Interview:
    for key, value in update_data.items():
        setattr(db_interview, key, value)
    db.commit()
    db.refresh(db_interview)
    return db_interview

# ------------------------------------------------------------
# 面接キャンセル（/cancel） ※柔軟な処理を分ける
# ------------------------------------------------------------
def cancel_interview(db: Session, db_interview: Interview) -> Interview:
    db_interview.status = InterviewStatus.canceled
    db.commit()
    db.refresh(db_interview)
    return db_interview

def delete_interview(db: Session, db_interview: Interview) -> None:
    db.delete(db_interview)
    db.commit()

def get_interviews_by_user(db: Session, user_id: int) -> List[Interview]:
    return db.query(Interview).filter(Interview.user_id == user_id).all()

def get_interviews_by_interviewer(db: Session, interviewer_id: int) -> List[Interview]:
    return db.query(Interview).filter(Interview.interviewer_id == interviewer_id).all()
