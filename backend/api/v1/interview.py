from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.api.deps import get_db, get_current_user, get_current_interviewer
from backend.schemas.interview import (
    InterviewCreate, 
    InterviewResponse, 
    InterviewStatusUpdate,
)
from backend.crud import interview as crud_interview

router = APIRouter()

# ============================================================
# 1. 面接予約
# ============================================================
@router.post("/", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview(
    interview_in: InterviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 面接予約を作成する
    return crud_interview.create_interview(
        db=db,
        user_id=current_user.id,
        interview_in=interview_in
    )

# ============================================================
# 2. 面接一覧取得（ユーザー自身）
# ============================================================
@router.get("/", response_model=List[InterviewResponse])
def list_user_interviews(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud_interview.get_interviews_by_user(db, current_user.id)

# ============================================================
# 3. 面接詳細取得
# ============================================================
@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview_detail(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    interview = crud_interview.get_interview(db, interview_id)
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

# ============================================================
# 4. 面接ステータス更新（管理用・面接官用）
# ============================================================
@router.patch("/{interview_id}/status", response_model=InterviewResponse)
def update_interview_status(
    interview_id: int,
    status_in: InterviewStatusUpdate,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_interviewer)
):
    interview = crud_interview.get_interview(db, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # 面接官以外が勝手に更新しないための制御
    if interview.interviewer_id != current_interviewer.id:
        raise HTTPException(status_code=403, detail="Not permitted")

    return crud_interview.update_status(db, interview_id, status_in.status)

# ============================================================
# 5. 面接キャンセル（ユーザー自身）
# ============================================================
@router.patch("/{interview_id}/cancel", response_model=InterviewResponse)
def cancel_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    interview = crud_interview.get_interview(db, interview_id)
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")

    # 面接の24時間前までキャンセル可能などの制御を追加可能
    # 例）
    # if interview.scheduled_at < datetime.now() + timedelta(hours=24):
    #     raise HTTPException(status_code=400, detail="Too late to cancel")

    return crud_interview.update_status(db, interview_id, "cancelled")