# app/crud/interviewer.py
from sqlalchemy.orm import Session
from backend.models.interviewer import Interviewer
from backend.schemas.interviewer import InterviewerCreate
from typing import List

def get_interviewer(db: Session, interviewer_id: int) -> Interviewer | None:
    return db.query(Interviewer).filter(Interviewer.id == interviewer_id).first()

def get_interviewer_by_email(db: Session, email: str) -> Interviewer | None:
    return db.query(Interviewer).filter(Interviewer.email == email).first()

def get_interviewers(db: Session, skip: int = 0, limit: int = 100) -> List[Interviewer]:
    return db.query(Interviewer).offset(skip).limit(limit).all()

def create_interviewer(db: Session, user_id: int, interviewer_in: InterviewerCreate) -> Interviewer:
    db_interviewer = Interviewer(
        user_id=user_id,
        profile=interviewer_in.profile,
        hourly_rate=interviewer_in.hourly_rate,
    )
    db.add(db_interviewer)
    db.commit()
    db.refresh(db_interviewer)
    return db_interviewer

def update_interviewer(db: Session, db_interviewer: Interviewer, update_data: dict) -> Interviewer:
    for key, value in update_data.items():
        setattr(db_interviewer, key, value)
    db.commit()
    db.refresh(db_interviewer)
    return db_interviewer

def delete_interviewer(db: Session, db_interviewer: Interviewer) -> None:
    db.delete(db_interviewer)
    db.commit()
