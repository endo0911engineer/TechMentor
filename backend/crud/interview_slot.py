# app/crud/interview_slot.py
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from backend.models.interview_slots import InterviewSlot

#取得系
def get_slot(db: Session, slot_id: int) -> InterviewSlot | None:
    return db.query(InterviewSlot).filter(InterviewSlot.id == slot_id).first()


def get_available_slots_by_interviewer(
    db: Session,
    interviewer_id: int,
) -> List[InterviewSlot]:
    return (
        db.query(InterviewSlot)
        .filter(
            InterviewSlot.interviewer_id == interviewer_id,
            InterviewSlot.is_available == True,
        )
        .order_by(InterviewSlot.start_at)
        .all()
    )


def get_all_slots_by_interviewer(
    db: Session,
    interviewer_id: int,
) -> List[InterviewSlot]:
    return (
        db.query(InterviewSlot)
        .filter(InterviewSlot.interviewer_id == interviewer_id)
        .order_by(InterviewSlot.start_at)
        .all()
    )


# 作成（面接官が枠を出す）
def create_slot(
    db: Session,
    interviewer_id: int,
    start_at: datetime,
    end_at: datetime,
) -> InterviewSlot:
    slot = InterviewSlot(
        interviewer_id=interviewer_id,
        start_at=start_at,
        end_at=end_at,
        is_available=True,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

# 状態変更
def mark_slot_unavailable(db: Session, slot: InterviewSlot) -> InterviewSlot:
    slot.is_available = False
    db.commit()
    db.refresh(slot)
    return slot

def mark_slot_available(db: Session, slot: InterviewSlot) -> InterviewSlot:
    slot.is_available = True
    db.commit()
    db.refresh(slot)
    return slot

# 削除
def delete_slot(db: Session, slot: InterviewSlot) -> None:
    db.delete(slot)
    db.commit()
