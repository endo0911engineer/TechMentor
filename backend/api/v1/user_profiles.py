# app/api/v1/user_profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas.user_profile import (
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileResponse,
)
from backend.api.deps import get_db, get_current_user
from backend.crud import user_profile as crud

router = APIRouter()

# ユーザプロフィールの作成
@router.post("/", response_model=UserProfileResponse)
def create_profile(
    profile_in: UserProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if current_user.profile:
        raise HTTPException(400, "Profile already exists")

    return crud.create(db, user_id=current_user.id, profile_in=profile_in)

# ユーザープロフィールの取得
@router.get("/me", response_model=UserProfileResponse)
def read_profile(
    current_user = Depends(get_current_user),
):
    return current_user.profile

# ユーザープロフィールの更新
@router.patch("/me", response_model=UserProfileResponse)
def update_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return crud.update(db, current_user.profile, profile_in)