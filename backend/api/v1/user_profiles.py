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
from backend.models.user import User

router = APIRouter()

@router.get("", response_model=UserProfileResponse | None)
def read_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user.user_profile

@router.put("", response_model=UserProfileResponse)
def upsert_profile(
    profile_in: UserProfileCreate | UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.user_profile:
        profile = crud.update(
            db=db,
            profile=current_user.user_profile,
            profile_in=profile_in,
        )
    else:
        profile = crud.create(
            db=db,
            user_id=current_user.id,
            profile_in=profile_in,
        )

    return profile


@router.post("/complete")
def complete_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.user_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Profile not found")

    # 完了条件チェック（例）
    if not all([
        profile.experience_years is not None,
        profile.english_level is not None,
        profile.target_level is not None,
        len(profile.skills) > 0,
    ]):
        raise HTTPException(
            status_code=400,
            detail="Profile is not complete",
        )

    current_user.is_profile_completed = True
    db.commit()

    return {"message": "Profile completed"}