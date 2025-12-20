# app/schemas/token.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal

UserRole = Literal["user", "interviewer", "admin"]

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    access_expires_at: Optional[datetime] = None
    role: Optional[UserRole] = None

class TokenWithRefresh(Token):
    refresh_token: str
    refresh_expires_at: Optional[datetime] = None