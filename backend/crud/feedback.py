# app/crud/feedback.py
from sqlalchemy.orm import Session
from backend.models.feedback import Feedback
from typing import List

def get_feedback(db: Session, feedback_id: int) -> Feedback | None:
    return db.query(Feedback).filter(Feedback.id == feedback_id).first()

def get_feedback_by_interview(db: Session, interview_id: int) -> Feedback | None:
    return db.query(Feedback).filter(Feedback.interview_id == interview_id).first()

def create_feedback(db: Session, feedback_data: dict) -> Feedback:
    db_feedback = Feedback(**feedback_data)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def update_feedback(db: Session, db_feedback: Feedback, update_data: dict) -> Feedback:
    for key, value in update_data.items():
        setattr(db_feedback, key, value)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def delete_feedback(db: Session, db_feedback: Feedback) -> None:
    db.delete(db_feedback)
    db.commit()
