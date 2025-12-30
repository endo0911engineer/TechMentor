# app/api/v1/interviews.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    InterviewStatusUpdate,
)
from backend.crud import interview as crud_interview
from backend.crud import interview_slot as crud_slot

from backend.api.deps import get_db, get_current_user_from_cookie
from backend.schemas.interview import (
    InterviewCreate, 
    InterviewResponse
)
from backend.crud import interview as crud_interview

router = APIRouter()

# 面接予約の作成
@router.post("/", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview(
    interview_in: InterviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie),
):
    # slot を取得
    slot = crud_slot.get_slot(db, interview_in.slot_id)
    if not slot or not slot.is_available:
        raise HTTPException(400, "Slot not available")

    interview = crud_interview.create_from_slot(
        db=db,
        user_id=current_user.id,
        slot=slot,
    )

    return interview

# ユーザー自身の面接一覧取得
@router.get("/", response_model=List[InterviewResponse])
def list_my_interviews(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie),
):
    return crud_interview.get_by_user(db, current_user.id)


# 面接詳細取得（user/interviewer両方対応）
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie),
):
    interview = crud_interview.get(db, interview_id)

    if not interview:
        raise HTTPException(404, "Interview not found")

    # user または interviewer のみ閲覧可
    if interview.user_id != current_user.id and \
       interview.interviewer_profile.user_id != current_user.id:
        raise HTTPException(403, "Not permitted")

    return interview

# 面接ステータス更新（面接官用）
@router.patch("/{interview_id}/status", response_model=InterviewResponse)
def update_status(
    interview_id: int,
    status_in: InterviewStatusUpdate,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie),
):
    interview = crud_interview.get(db, interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")

    if interview.interviewer_profile_id != current_interviewer.id:
        raise HTTPException(403, "Not permitted")

    return crud_interview.update_status(
        db,
        interview=interview,
        new_status=status_in.status,
    )


# キャンセル（ユーザー用）
@router.patch("/{interview_id}/cancel", response_model=InterviewResponse)
def cancel_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie),
):
    interview = crud_interview.get(db, interview_id)

    if not interview or interview.user_id != current_user.id:
        raise HTTPException(404, "Interview not found")

    if not interview.can_be_cancelled():
        raise HTTPException(400, "Too late to cancel")

    return crud_interview.update_status(
        db,
        interview=interview,
        new_status="canceled",
    )