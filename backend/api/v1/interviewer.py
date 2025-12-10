# app/api/v1/interviewer.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.schemas.interviewer import InterviewerCreate, InterviewerResponse
from backend.schemas.schedule import ScheduleCreate, ScheduleResponse
from backend.crud import schedule as crud_schedule
from backend.crud import interviewer as crud_interviewer
from backend.api.deps import get_db, get_current_interviewer, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from backend.core.security import verify_password, create_access_token
from backend.crud import interviewer as crud_interviewer

router = APIRouter()

@router.get("", response_model=List[InterviewerResponse])
def list_interviewers(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return crud_interviewer.get_interviewers(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=InterviewerResponse)
def get_interviewer(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    interviewer = crud_interviewer.get_interviewer(db, id)
    if not interviewer:
        raise HTTPException(status_code=404, detail="Interviewer not found")
    return interviewer

# 面接官自身の情報取得
@router.get("/me", response_model=InterviewerResponse)
def read_own_profile(current_interviewer = Depends(get_current_interviewer)):
    return current_interviewer

# 面接官自身の更新
@router.put("/me", response_model=InterviewerResponse)
def update_own_profile(update_data: dict, db: Session = Depends(get_db), current_interviewer = Depends(get_current_interviewer)):
    return crud_interviewer.update_interviewer(db, current_interviewer, update_data)

# スケジュール登録
@router.post("/me/schedules", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_interviewer)
):
    return crud_schedule.create_schedule(db, current_interviewer.id, schedule_in)

# スケジュール削除
@router.delete("/me/schedules/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_interviewer)
):
    schedule = crud_schedule.get_schedule(db, schedule_id)

    if not schedule or schedule.interviewer_id != current_interviewer.id:
        raise HTTPException(status_code=404, detail="Schedule not found")

    crud_schedule.delete_schedule(db, schedule_id)
    return {"message": "Deleted successfully"}