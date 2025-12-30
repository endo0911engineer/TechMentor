# app/api/v1/interviews_slots.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.api.deps import get_db, get_current_user_from_cookie
from backend.schemas.interview_slot import (
    InterviewSlotCreate,
    InterviewSlotResponse,
)
from backend.crud import interview_slot as crud_slot

router = APIRouter()

# 面接スロットの作成
@router.post(
    "",
    response_model=InterviewSlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_interview_slot(
    slot_in: InterviewSlotCreate,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie),
):
    if slot_in.start_at >= slot_in.end_at:
        raise HTTPException(
            status_code=400,
            detail="start_at must be earlier than end_at",
        )

    return crud_slot.create_slot(
        db=db,
        interviewer_id=current_interviewer.user_id,
        start_at=slot_in.start_at,
        end_at=slot_in.end_at,
    )

# 面接スロット一覧取得
@router.get(
    "/me",
    response_model=List[InterviewSlotResponse],
)
def list_my_interview_slots(
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie),
):
    return crud_slot.get_slots_by_interviewer(
        db=db,
        interviewer_id=current_interviewer.user_id,
    )

# スロット詳細取得
@router.get(
    "/{slot_id}",
    response_model=InterviewSlotResponse,
)
def get_interview_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie),
):
    slot = crud_slot.get_slot(db, slot_id)
    if not slot or slot.interviewer_id != current_interviewer.user_id:
        raise HTTPException(status_code=404, detail="Slot not found")
    return slot

# スロット削除
@router.delete(
    "/{slot_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_interview_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie),
):
    slot = crud_slot.get_slot(db, slot_id)
    if not slot or slot.interviewer_id != current_interviewer.user_id:
        raise HTTPException(status_code=404, detail="Slot not found")

    if not slot.is_available:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a slot already booked",
        )

    crud_slot.delete_slot(db, slot)
    return None