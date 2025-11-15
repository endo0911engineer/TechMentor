# app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.schemas.user import UserCreate, UserResponse
from backend.crud import user as crud_user
from backend.api.deps import get_db, get_current_user

router = APIRouter()

# 認証不要：ユーザー作成
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = crud_user.get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud_user.create_user(db, user_in)

# 認証不要（公開一覧） — 開発中は制限可能
@router.get("/", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_user.get_users(db, skip=skip, limit=limit)

# 認証不要（ID指定で参照） — ただし個人情報は注意
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud_user.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

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
