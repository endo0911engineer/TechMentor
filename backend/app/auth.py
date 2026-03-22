"""管理者認証: httpOnly Cookie セッション管理"""
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Cookie, HTTPException

SESSION_COOKIE = "admin_session"
SESSION_TTL = timedelta(hours=8)
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

# in-memory セッションストア: token -> expiry
_sessions: dict[str, datetime] = {}


def create_session() -> str:
    token = secrets.token_urlsafe(32)
    _sessions[token] = datetime.utcnow() + SESSION_TTL
    return token


def revoke_session(token: str) -> None:
    _sessions.pop(token, None)


def validate_session(token: str) -> bool:
    expiry = _sessions.get(token)
    if not expiry:
        return False
    if datetime.utcnow() > expiry:
        del _sessions[token]
        return False
    return True


def verify_admin(admin_session: Optional[str] = Cookie(None)) -> None:
    if not admin_session or not validate_session(admin_session):
        raise HTTPException(status_code=401, detail="認証が必要です")
