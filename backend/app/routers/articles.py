from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.article import Article
from app.schemas.article import ArticleRead

router = APIRouter()


@router.get("", response_model=List[ArticleRead])
def list_articles(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Article).order_by(Article.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{slug}", response_model=ArticleRead)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.slug == slug).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
