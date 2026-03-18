import os
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.submission import SalarySubmission, InterviewSubmission
from app.models.company import Company
from app.models.article import Article
from app.schemas.company import CompanyCreate, CompanyRead, CompanyUpdate
from app.schemas.article import ArticleCreate, ArticleRead

router = APIRouter()

ADMIN_KEY = os.getenv("ADMIN_KEY")
if not ADMIN_KEY:
    raise RuntimeError("ADMIN_KEY environment variable is not set")


def verify_admin(x_admin_key: Optional[str] = Header(None)):
    if x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")


# --- Salary submissions ---

@router.get("/salary-submissions")
def list_pending_salary(
    db: Session = Depends(get_db), _: None = Depends(verify_admin)
):
    return db.query(SalarySubmission).filter(SalarySubmission.is_approved == False).all()


@router.post("/salary-submissions/{submission_id}/approve")
def approve_salary(
    submission_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    s = db.query(SalarySubmission).filter(SalarySubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_approved = True
    db.commit()
    return {"message": "approved"}


@router.delete("/salary-submissions/{submission_id}")
def delete_salary(
    submission_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    s = db.query(SalarySubmission).filter(SalarySubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(s)
    db.commit()
    return {"message": "deleted"}


# --- Interview submissions ---

@router.get("/interview-submissions")
def list_pending_interview(
    db: Session = Depends(get_db), _: None = Depends(verify_admin)
):
    return db.query(InterviewSubmission).filter(InterviewSubmission.is_approved == False).all()


@router.post("/interview-submissions/{submission_id}/approve")
def approve_interview(
    submission_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    s = db.query(InterviewSubmission).filter(InterviewSubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_approved = True
    db.commit()
    return {"message": "approved"}


@router.delete("/interview-submissions/{submission_id}")
def delete_interview(
    submission_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    s = db.query(InterviewSubmission).filter(InterviewSubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(s)
    db.commit()
    return {"message": "deleted"}


# --- Companies ---

@router.get("/companies", response_model=List[CompanyRead])
def list_all_companies(
    db: Session = Depends(get_db), _: None = Depends(verify_admin)
):
    return db.query(Company).order_by(Company.is_approved, Company.name).all()


@router.patch("/companies/{company_id}", response_model=CompanyRead)
def update_company(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company


@router.post("/companies/{company_id}/approve", response_model=CompanyRead)
def approve_company(
    company_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    company.is_approved = True
    db.commit()
    db.refresh(company)
    return company


@router.delete("/companies/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(company)
    db.commit()
    return {"message": "deleted"}


@router.post("/companies", response_model=CompanyRead)
def create_company_admin(
    data: CompanyCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    company = Company(**data.model_dump(), is_approved=True)
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


# --- Articles ---

@router.get("/articles", response_model=List[ArticleRead])
def list_articles(
    db: Session = Depends(get_db), _: None = Depends(verify_admin)
):
    return db.query(Article).order_by(Article.created_at.desc()).all()


@router.post("/articles", response_model=ArticleRead)
def create_article(
    data: ArticleCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    existing = db.query(Article).filter(Article.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    article = Article(**data.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.delete("/articles/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(article)
    db.commit()
    return {"message": "deleted"}
