# app/crud/interview.py
from sqlalchemy.orm import Session
from typing import List

from backend.models.interview import Interview, InterviewStatus
from backend.models.interview_slots import InterviewSlot
from backend.schemas.interview import InterviewCreate
from backend.service.meet import generate_meet_url
from backend.crud import interview_slot as crud_slot

# 取得系
def get_interview(db: Session, interview_id: int) -> Interview | None:
    return db.query(Interview).filter(Interview.id == interview_id).first()


def get_interviews_by_user(db: Session, user_id: int) -> List[Interview]:
    return db.query(Interview).filter(Interview.user_id == user_id).all()

def get_interviews_by_interviewer(db: Session, interviewer_id: int) -> List[Interview]:
    return db.query(Interview).filter(
        Interview.interviewer_id == interviewer_id
    ).all()


# slotを起点にして作成
def create_interview(
    db: Session,
    user_id: int,
    interview_in: InterviewCreate,
) -> Interview:
    # slot を取得
    slot: InterviewSlot | None = crud_slot.get_slot(db, interview_in.slot_id)
    if not slot or not slot.is_available:
        raise ValueError("Slot not available")

    # Meet URL 発行
    meet_url = generate_meet_url()

    # Interview 作成
    interview = Interview(
        user_id=user_id,
        interviewer_id=slot.interviewer_id,
        scheduled_at=slot.start_at,
        duration_min=slot.duration_min,
        status=InterviewStatus.scheduled,
        meet_url=meet_url,
    )

    db.add(interview)

    crud_slot.mark_slot_unavailable(db, slot)

    db.commit()
    db.refresh(interview)
    return interview


# ステータス更新（面接官）
def update_interview_status(
    db: Session,
    interview: Interview,
    new_status: InterviewStatus
) -> Interview:
    interview.status = new_status
    db.commit()
    db.refresh(interview)
    return interview

# 面接キャンセル（ユーザー）
def cancel_interview(
    db: Session,
    interview: Interview,
) -> Interview:
    interview.status = InterviewStatus.canceled

    # slot を再度空ける
    slot = (
        db.query(InterviewSlot)
        .filter(
            InterviewSlot.interviewer_id == interview.interviewer_id,
            InterviewSlot.start_at == interview.scheduled_at,
        )
        .first()
    )
    
    if slot:
        crud_slot.mark_slot_available(db, slot)

    db.commit()
    db.refresh(interview)
    return interview

# 面接削除（管理用）
def delete_interview(db: Session, db_interview: Interview) -> None:
    db.delete(db_interview)
    db.commit()

