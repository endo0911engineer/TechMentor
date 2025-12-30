# app/api/v1/experiences.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.schemas.experience import (
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceResponse,
)
from backend.api.deps import get_db, get_current_user_from_cookie
from backend.crud import experience as crud

router = APIRouter()

@router.post("/", response_model=ExperienceResponse)
def create_experience(
    exp_in: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_cookie),
):
    return crud.create(db, current_user.id, exp_in)

@router.patch("/{exp_id}", response_model=ExperienceResponse)
def update_experience(
    exp_id: int,
    exp_in: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_cookie),
):
    return crud.update(db, exp_id, current_user.id, exp_in)