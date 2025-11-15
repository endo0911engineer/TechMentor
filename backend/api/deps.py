# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from backend.core.database import get_db
from backend.core.config import settings
from backend.crud import user as crud_user
from backend.crud import interviewer as crud_interviewer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    JWT の sub クレームに user_id を含めている前提。
    sub が "user:{id}" か "interviewer:{id}" を使い分ける設計にしても良いです。
    ここでは token['sub'] に "user:{id}" を想定します。
    """
    payload = decode_access_token(token)
    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing sub")
    # 期待する sub の形式: "user:<id>"
    if not str(sub).startswith("user:"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    try:
        user_id = int(sub.split(":", 1)[1])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject format")

    user = crud_user.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def get_current_interviewer(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing sub")
    if not str(sub).startswith("interviewer:"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject for interviewer")
    try:
        interviewer_id = int(sub.split(":", 1)[1])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject format")

    interviewer = crud_interviewer.get_interviewer(db, interviewer_id)
    if not interviewer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Interviewer not found")
    return interviewer
