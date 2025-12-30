# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from backend.core.config import settings
from backend.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from backend.crud import user as crud_user
from backend.crud import interviewer_profile as crud_interviewer
from backend.core.database import get_db
from backend.schemas.token import TokenWithRefresh
from backend.api.deps import get_current_user_from_cookie
from backend.models.user import User

router = APIRouter()

@router.post("/token")
def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    OAuth2 Resource Owner Password Credentials フローを使用。
    username = email として処理
    """
    user = crud_user.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    access_token = create_access_token(sub=str(user.id), extra_claims={"role": user.role}, expires_delta=access_expires)
    refresh_token = create_refresh_token(sub=str(user.id), extra_claims={"role": user.role}, expires_delta=refresh_expires)

    # Cookieにセット
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False, # 開発環境ならFalse
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return {"message": "Logged in successfully", "role": user.role}

@router.post("/token/refresh")
def refresh_token(request: Request,
                  response: Response,
                  db: Session = Depends(get_db)
):
    """
    リフレッシュトークンを検証して、新しいアクセストークンとリフレッシュトークンを発行
    """
    from jose import JWTError

    try:
        payload = decode_token(refresh_token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = crud_user.get_user(db, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # トークン再発行
    access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    new_access = create_access_token(sub=str(user.id), role=user.role, expires_delta=access_expires)
    new_refresh = create_refresh_token(sub=str(user.id), expires_delta=refresh_expires)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False, # 開発環境ならFalse
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {"message": "Token refreshed"}

@router.get("/role")
def get_user_role(
    current_user: User = Depends(get_current_user_from_cookie),
):
    return {
        "role": current_user.role,
        "is_profile_completed": current_user.is_profile_completed,
    }