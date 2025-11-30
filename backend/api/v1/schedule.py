from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.api.deps import get_db, get_current_interviewer
from backend.schemas.schedule import (
    ScheduleCreate, 
    ScheduleResponse,
)
from backend.crud import schedule as crud_schedule 
from backend.models.interviewer import Interviewer # 面接官モデル（CRUD関数からの戻り値の型ヒント用）

router = APIRouter()

# ============================================================
# 1. 空き時間枠の登録 (面接官専用)
# ============================================================
@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
    # 依存性として get_current_interviewer を使用
    current_interviewer: Interviewer = Depends(get_current_interviewer)
):
    """
    面接官が自身の空き時間枠を登録する。
    """
    return crud_schedule.create_schedule(
        db=db,
        interviewer_id=current_interviewer.id,
        schedule_in=schedule_in
    )

# ============================================================
# 2. 面接官の空き時間枠一覧取得 (全ユーザーから参照可能)
# ============================================================
@router.get("/interviewer/{interviewer_id}", response_model=List[ScheduleResponse])
def list_interviewer_schedules(
    interviewer_id: int,
    db: Session = Depends(get_db),
    # 認証は不要（オプションで get_db のみ）
):
    """
    特定の面接官が登録した空き時間枠を一覧で取得する。
    """
    # 既に予約が入っているものなど、公開するスケジュールをフィルタリングするロジックをCRUD層で実装
    return crud_schedule.get_schedules_by_interviewer(db, interviewer_id=interviewer_id)


# ============================================================
# 3. 自身の空き時間枠の削除 (面接官専用)
# ============================================================
@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_interviewer: Interviewer = Depends(get_current_interviewer)
):
    """
    面接官が登録した自身の空き時間枠を削除する。
    """
    # 削除対象のスケジュールを取得し、削除権限（interviewer_idの一致）をチェックする
    schedule = crud_schedule.get_schedule(db, schedule_id)
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Schedule not found"
        )
    
    # 面接官IDが一致するか検証
    if schedule.interviewer_id != current_interviewer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You are not authorized to delete this schedule"
        )

    crud_schedule.remove_schedule(db, schedule_id=schedule_id)
    return {"detail": "Schedule deleted successfully"}