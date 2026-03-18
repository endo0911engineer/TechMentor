from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArticleCreate(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None


class ArticleRead(BaseModel):
    id: int
    title: str
    slug: str
    content: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
