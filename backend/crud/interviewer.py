# app/crud/interviewer.py
from sqlalchemy.orm import Session
from backend.models.interviewer_profile import InterviewerProfile
from backend.schemas.interviewer import InterviewerProfileCreate
from typing import List

def get_interviewer(db: Session, interviewer_id: int) -> InterviewerProfile| None:
    return db.query(InterviewerProfile).filter(InterviewerProfile.id == interviewer_id).first()

def get_interviewer_by_email(db: Session, email: str) -> InterviewerProfile | None:
    return db.query(InterviewerProfile).filter(InterviewerProfile.email == email).first()

def get_interviewers(db: Session, skip: int = 0, limit: int = 100) -> List[InterviewerProfile]:
    return db.query(InterviewerProfile).offset(skip).limit(limit).all()

def get_interviewer_by_user_id(db: Session, user_id: int) -> InterviewerProfile | None:
    return (db.query(InterviewerProfile).filter(InterviewerProfile.user_id == user_id).first())

def create_interviewer(db: Session, interviewer_in: InterviewerProfileCreate) -> InterviewerProfile:
    db_interviewer = InterviewerProfile(
        user_id=interviewer_in.user_id,
        profile=interviewer_in.profile,
        hourly_rate=interviewer_in.hourly_rate,
    )
    db.add(db_interviewer)
    db.commit()
    db.refresh(db_interviewer)
    return db_interviewer

def update_interviewer(db: Session, db_interviewer: InterviewerProfile, update_data: dict) -> InterviewerProfile:
    for key, value in update_data.items():
        setattr(db_interviewer, key, value)
    db.commit()
    db.refresh(db_interviewer)
    return db_interviewer

def delete_interviewer(db: Session, db_interviewer: InterviewerProfile) -> None:
    db.delete(db_interviewer)
    db.commit()
