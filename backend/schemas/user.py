from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr
    profile: Optional[Any] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
