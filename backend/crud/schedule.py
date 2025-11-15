# app/crud/schedule.py
from sqlalchemy.orm import Session
from backend.models.schedule import Schedule
from typing import List

def get_schedule(db: Session, schedule_id: int) -> Schedule | None:
    return db.query(Schedule).filter(Schedule.id == schedule_id).first()

def get_schedules_by_interviewer(db: Session, interviewer_id: int) -> List[Schedule]:
    return db.query(Schedule).filter(Schedule.interviewer_id == interviewer_id).all()

def create_schedule(db: Session, schedule_data: dict) -> Schedule:
    db_schedule = Schedule(**schedule_data)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def update_schedule(db: Session, db_schedule: Schedule, update_data: dict) -> Schedule:
    for key, value in update_data.items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def delete_schedule(db: Session, db_schedule: Schedule) -> None:
    db.delete(db_schedule)
    db.commit()
