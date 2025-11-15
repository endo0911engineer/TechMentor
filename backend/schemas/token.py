# app/schemas/token.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    access_expires_at: Optional[datetime] = None

class TokenWithRefresh(Token):
    refresh_token: str
    refresh_expires_at: Optional[datetime] = None