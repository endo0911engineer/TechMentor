from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database import get_db
from app.auth import verify_admin
from app.models.industry import Industry

router = APIRouter()


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
