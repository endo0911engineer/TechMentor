# app/api/deps.py
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from backend.core.database import get_db
from backend.core.config import settings
from backend.core.security import get_current_user_from_token
from backend.crud import user as crud_user
from backend.crud import interviewer_profile as crud_interviewer


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
    
def get_current_user_from_cookie(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return get_current_user_from_token(token, db)


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    JWT の sub クレームに admin_id を含めている前提 (例: "admin:<id>")。
    認証されたユーザーが管理者であることを検証する。
    """
    payload = decode_access_token(token)
    sub = payload.get("sub")
    
    if sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing sub")

    # 1. 'sub' クレームが管理者 (admin) 専用のプレフィックスを持っているか確認
    if not str(sub).startswith("admin:"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="管理者専用トークンではありません")

    try:
        admin_id = int(sub.split(":", 1)[1])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject format")

    # 2. 管理者ユーザーの情報をデータベースから取得（管理者用の CRUD 関数が必要）
    # 仮に、管理者も 'crud_user' を使って取得できる 'User' モデルであると仮定し、
    # そのモデルに 'is_admin' フラグがあることを確認します。
    # 実際には管理者専用のテーブル (crud_admin) やフラグ (is_admin) のチェックが必要です。
    admin_user = crud_user.get_user(db, admin_id) # ★ 管理者IDでユーザーを取得

    if not admin_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin user not found")
    
    # 3. 取得したユーザーが本当に管理者であるか最終確認 (モデルに 'is_admin' がある場合)
    if not hasattr(admin_user, 'is_admin') or not admin_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="権限が不足しています (非アクティブまたは非管理者)")

    return admin_user
