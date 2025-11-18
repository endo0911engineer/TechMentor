# app/api/v1/interviewer.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.schemas.interviewer import InterviewerCreate, InterviewerResponse
from backend.schemas.schedule import ScheduleCreate, ScheduleResponse
from backend.crud import schedule as crud_schedule
from backend.crud import interviewer as crud_interviewer
from backend.api.deps import get_db, get_current_interviewer
from fastapi.security import OAuth2PasswordRequestForm
from backend.core.security import verify_password, create_access_token
from backend.crud import interviewer as crud_interviewer

router = APIRouter()

# 面接官自身の情報取得
@router.get("/me", response_model=InterviewerResponse)
def read_own_profile(current_interviewer = Depends(get_current_interviewer)):
    return current_interviewer

# 面接官自身の更新
@router.put("/me", response_model=InterviewerResponse)
def update_own_profile(update_data: dict, db: Session = Depends(get_db), current_interviewer = Depends(get_current_interviewer)):
    return crud_interviewer.update_interviewer(db, current_interviewer, update_data)

# (管理用途) 全面接官一覧 — 認証/権限が必要（ここは一旦公開しているが後で制限する）
@router.get("/all", response_model=List[InterviewerResponse])
def list_interviewers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_interviewer.get_interviewers(db, skip=skip, limit=limit)

# 面接官ログイン
@router.post("/login")
def login_interviewer(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    interviewer = crud_interviewer.get_interviewer_by_email(db, form_data.username)
    if not interviewer:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(form_data.password, interviewer.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(interviewer.id), "role": "interviewer"})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "interviewer_id": interviewer.id,
    }

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