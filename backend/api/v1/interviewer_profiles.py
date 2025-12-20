# app/api/v1/interviewer_profiles.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas.interviewer import (
    InterviewerProfileCreate,
    InterviewerProfileUpdate,
    InterviewerProfileResponse,
)
from backend.api.deps import get_db, get_current_user
from backend.crud import interviewer_profile as crud

router = APIRouter()

# 面接官プロフィールの作成
@router.post("/", response_model=InterviewerProfileResponse)
def create_interviewer_profile(
    profile_in: InterviewerProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if current_user.role != "interviewer":
        raise HTTPException(403, "Not an interviewer")

    return crud.create(db, current_user.id, profile_in)

# 面接官プロフィールの更新
@router.patch("/me", response_model=InterviewerProfileResponse)
def update_interviewer_profile(
    profile_in: InterviewerProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return crud.update(db, current_user.interviewer_profile, profile_in)