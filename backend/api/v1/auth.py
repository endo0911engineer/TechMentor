# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from backend.core.config import settings
from backend.core.security import verify_password, create_access_token, create_refresh_token
from backend.crud import user as crud_user
from backend.crud import interviewer as crud_interviewer
from backend.core.database import get_db
from backend.schemas.token import TokenWithRefresh

router = APIRouter(prefix="auth", tags=["auth"])

@router.post("/token", response_model=TokenWithRefresh)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    標準の OAuth2 Resource Owner Password Credentials フローのフォームを使用。
    form_data.username / form_data.password を利用。
    """
    username = form_data.username
    password = form_data.password

    # user
    user = crud_user.get_user_by_email(db, username)
    if user and verify_password(password, user.password_hash):
        # 作成
        access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        access_token = create_access_token(sub=f"user:{user.id}", expires_delta=access_expires)
        refresh_token = create_refresh_token(sub=f"user:{user.id}", expires_delta=refresh_expires)
        access_expires_at = datetime.utcnow() + access_expires
        refresh_expires_at = datetime.utcnow() + refresh_expires
        return TokenWithRefresh(
            access_token=access_token,
            token_type="bearer",
            access_expires_at=access_expires_at,
            refresh_token=refresh_token,
            refresh_expires_at=refresh_expires_at,
        )

    # interviewers
    interviewer = crud_interviewer.get_interviewer_by_email(db, username)
    if interviewer and verify_password(password, interviewer.password_hash):
        access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        access_token = create_access_token(sub=f"interviewer:{interviewer.id}", expires_delta=access_expires)
        refresh_token = create_refresh_token(sub=f"interviewer:{interviewer.id}", expires_delta=refresh_expires)
        access_expires_at = datetime.utcnow() + access_expires
        refresh_expires_at = datetime.utcnow() + refresh_expires
        return TokenWithRefresh(
            access_token=access_token,
            token_type="bearer",
            access_expires_at=access_expires_at,
            refresh_token=refresh_token,
            refresh_expires_at=refresh_expires_at,
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/token/refresh", response_model=TokenWithRefresh)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """
    シンプル実装: クライアントがリフレッシュトークンを渡す -> 検証 -> 新しいアクセストークン + 新しいリフレッシュトークンを発行
    ※ 実運用ではリフレッシュトークンのサーバ側保存/失効管理を推奨。
    """
    from backend.core.security import decode_token
    from jose import JWTError

    try:
        payload = decode_token(refresh_token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    # 発行対象が user か interviewer か判定して DB 存在確認
    if str(sub).startswith("user:"):
        user_id = int(sub.split(":", 1)[1])
        user = crud_user.get_user(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        # 再発行
        access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        new_access = create_access_token(sub=sub, expires_delta=access_expires)
        new_refresh = create_refresh_token(sub=sub, expires_delta=refresh_expires)
        return TokenWithRefresh(
            access_token=new_access,
            token_type="bearer",
            access_expires_at=datetime.utcnow() + access_expires,
            refresh_token=new_refresh,
            refresh_expires_at=datetime.utcnow() + refresh_expires,
        )

    if str(sub).startswith("interviewer:"):
        interviewer_id = int(sub.split(":", 1)[1])
        interviewer = crud_interviewer.get_interviewer(db, interviewer_id)
        if not interviewer:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Interviewer not found")
        access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        new_access = create_access_token(sub=sub, expires_delta=access_expires)
        new_refresh = create_refresh_token(sub=sub, expires_delta=refresh_expires)
        return TokenWithRefresh(
            access_token=new_access,
            token_type="bearer",
            access_expires_at=datetime.utcnow() + access_expires,
            refresh_token=new_refresh,
            refresh_expires_at=datetime.utcnow() + refresh_expires,
        )

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid subject in refresh token")