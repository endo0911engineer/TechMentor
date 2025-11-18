# app/api/v1/profile.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.user import ProfileUpdateRequest, UserResponse
from backend.api.deps import get_db, get_current_user
from backend.crud import user as crud_user

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_200_OK)
def create_initial_profile(
    profile_in: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    初回プロフィール登録
    - users.profile に JSON として保存
    """
    if current_user.profile:
        raise HTTPException(status_code=400, detail="Profile already exists")

    updated_user = crud_user.update_user(db, current_user, profile_in.dict())
    return updated_user

# 認証必須: 自分のプロフィールを取得
@router.get("/me", response_model=UserResponse)
def read_own_profile(current_user = Depends(get_current_user)):
    return current_user

# 認証必須: 自分のプロフィール更新
@router.put("/me", response_model=UserResponse)
def update_own_profile(update_data: dict, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_user.update_user(db, current_user, update_data)

# 認証必須: 自分アカウント削除
@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_own_account(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    crud_user.delete_user(db, current_user)
    return None