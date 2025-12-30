from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.api.deps import get_db, get_current_user_from_cookie
from backend.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from backend.crud import feedback as crud_feedback

router = APIRouter()

# ============================================================
# 1. フィードバック作成（面接官のみ）
# ============================================================
@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie)
):
    return crud_feedback.create_feedback(
        db=db,
        interviewer_id=current_interviewer.id,
        feedback_in=feedback_in
    )


# ============================================================
# 2. フィードバック一覧取得（ユーザー自身が面接のフィードバックを確認）
# ============================================================
@router.get("/my", response_model=List[FeedbackResponse])
def list_my_feedbacks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie)
):
    return crud_feedback.get_feedbacks_by_user(db, current_user.id)

# ============================================================
# 3. フィードバック取得（面接官・ユーザー共通）
# ============================================================
@router.get("/{feedback_id}", response_model=FeedbackResponse)
def get_feedback_detail(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie)
):
    feedback = crud_feedback.get_feedback(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    # 所有チェック: ユーザーか面接官のみ
    if feedback.user_id != current_user.id and feedback.interviewer_id != getattr(current_user, "id", None):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return feedback


# ============================================================
# 4. フィードバック更新（面接官のみ）
# ============================================================
@router.put("/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(
    feedback_id: int,
    feedback_in: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie)
):
    feedback = crud_feedback.get_feedback(db, feedback_id)
    if not feedback or feedback.interviewer_id != current_interviewer.id:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return crud_feedback.update_feedback(db, feedback, feedback_in)

# ============================================================
# 5. フィードバック削除（面接官のみ）
# ============================================================
@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_interviewer=Depends(get_current_user_from_cookie)
):
    feedback = crud_feedback.get_feedback(db, feedback_id)
    if not feedback or feedback.interviewer_id != current_interviewer.id:
        raise HTTPException(status_code=404, detail="Feedback not found")
    crud_feedback.delete_feedback(db, feedback)
    return None
