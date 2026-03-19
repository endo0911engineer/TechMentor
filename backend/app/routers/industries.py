from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import os
from app.database import get_db
from app.models.industry import Industry

router = APIRouter()

ADMIN_KEY = os.getenv("ADMIN_KEY")


def verify_admin(x_admin_key: Optional[str] = Header(None)):
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")


class IndustryRead(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}


class IndustryCreate(BaseModel):
    name: str


@router.get("", response_model=List[IndustryRead])
def list_industries(db: Session = Depends(get_db)):
    return db.query(Industry).order_by(Industry.name).all()


@router.post("", response_model=IndustryRead, status_code=201)
def create_industry(
    data: IndustryCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    existing = db.query(Industry).filter(Industry.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="既に存在する業種です")
    industry = Industry(name=data.name)
    db.add(industry)
    db.commit()
    db.refresh(industry)
    return industry


@router.delete("/{industry_id}", status_code=204)
def delete_industry(
    industry_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    industry = db.query(Industry).filter(Industry.id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(industry)
    db.commit()
