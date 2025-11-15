# app/crud/interview.py
from sqlalchemy.orm import Session
from backend.models.interview import Interview
from typing import List
from datetime import datetime

def get_interview(db: Session, interview_id: int) -> Interview | None:
    return db.query(Interview).filter(Interview.id == interview_id).first()

def get_interviews(db: Session, skip: int = 0, limit: int = 100) -> List[Interview]:
    return db.query(Interview).offset(skip).limit(limit).all()

def create_interview(db: Session, interview_data: dict) -> Interview:
    db_interview = Interview(**interview_data)
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

def update_interview(db: Session, db_interview: Interview, update_data: dict) -> Interview:
    for key, value in update_data.items():
        setattr(db_interview, key, value)
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
