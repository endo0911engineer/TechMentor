from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.api.deps import get_db, get_current_user, get_current_interviewer, get_current_admin
from backend.schemas.reward import RewardResponse
from backend.crud import reward as crud_reward

router = APIRouter()

# ============================================================
# 面接官報酬一覧取得
# ============================================================
@router.get("/rewards/my", response_model=List[RewardResponse])
def list_rewards(
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_interviewer)
):
    return crud_reward.get_rewards_by_interviewer(db, current_interviewer.id)

# ============================================================
# 面接単位の報酬詳細取得
# ============================================================
@router.get("/rewards/{interview_id}", response_model=RewardResponse)
def get_reward_detail(
    interview_id: int,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_interviewer)
):
    reward = crud_reward.get_reward_by_interview(db, interview_id)
    if not reward or reward.interviewer_id != current_interviewer.id:
        raise HTTPException(status_code=404, detail="Reward not found")

    return reward
