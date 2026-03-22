import os
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.limiter import limiter
from app.auth import (
    SESSION_COOKIE, SESSION_TTL, COOKIE_SECURE,
    create_session, revoke_session, validate_session, verify_admin,
)
from app.models.submission import SalarySubmission, InterviewSubmission
from app.models.company import Company
from app.models.article import Article
from app.models.contact import Contact
from app.schemas.company import CompanyCreate, CompanyRead, CompanyUpdate
from app.schemas.article import ArticleCreate, ArticleRead

router = APIRouter()

ADMIN_KEY = os.getenv("ADMIN_KEY")


# --- 認証エンドポイント ---

class LoginRequest(BaseModel):
    key: str


@router.post("/login")
@limiter.limit("10/hour")
def login(request: Request, data: LoginRequest, response: Response):
    if not ADMIN_KEY or data.key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="管理者キーが正しくありません")
    token = create_session()
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="strict",
        max_age=int(SESSION_TTL.total_seconds()),
        path="/",
    )
    return {"ok": True}


@router.post("/logout")
def logout(response: Response, admin_session: Optional[str] = Cookie(None)):
    if admin_session:
        revoke_session(admin_session)
    response.delete_cookie(key=SESSION_COOKIE, path="/")
    return {"ok": True}


@router.get("/me")
def me(_: None = Depends(verify_admin)):
    return {"ok": True}


# --- Schemas ---

class SalarySubmissionAdmin(BaseModel):
    id: int
    company_id: int
    company_name: str
    job_title: Optional[str] = None
    years_of_experience: Optional[int] = None
    salary: Optional[int] = None
    salary_breakdown: Optional[str] = None
    location: Optional[str] = None
    remote_type: Optional[str] = None
    overtime_feeling: Optional[str] = None
    tech_stack: Optional[str] = None
    comment: Optional[str] = None
    is_approved: bool
    created_at: str

    model_config = {"from_attributes": True}


class SalarySubmissionUpdate(BaseModel):
    job_title: Optional[str] = None
    years_of_experience: Optional[int] = None
    salary: Optional[int] = None
    salary_breakdown: Optional[str] = None
    location: Optional[str] = None
    remote_type: Optional[str] = None
    overtime_feeling: Optional[str] = None
    tech_stack: Optional[str] = None
    comment: Optional[str] = None


class InterviewSubmissionAdmin(BaseModel):
    id: int
    company_id: int
    company_name: str
    job_title: Optional[str] = None
    employment_type: Optional[str] = None
    interview_rounds: Optional[int] = None
    result: Optional[str] = None
    difficulty: Optional[str] = None
    tags: Optional[str] = None
    interview_content: Optional[str] = None
    is_approved: bool
    created_at: str

    model_config = {"from_attributes": True}


class InterviewSubmissionUpdate(BaseModel):
    job_title: Optional[str] = None
    employment_type: Optional[str] = None
    interview_rounds: Optional[int] = None
    result: Optional[str] = None
    difficulty: Optional[str] = None
    tags: Optional[str] = None
    interview_content: Optional[str] = None


# --- Salary submissions ---

@router.get("/salary-submissions", response_model=List[SalarySubmissionAdmin])
def list_all_salary(db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    rows = (
        db.query(SalarySubmission, Company.name)
        .join(Company, SalarySubmission.company_id == Company.id)
        .order_by(SalarySubmission.is_approved, SalarySubmission.created_at.desc())
        .all()
    )
    return [
        SalarySubmissionAdmin(
            **{c.name: getattr(sub, c.name) for c in SalarySubmission.__table__.columns if c.name != "created_at"},
            company_name=name,
            created_at=str(sub.created_at),
        )
        for sub, name in rows
    ]


@router.patch("/salary-submissions/{submission_id}")
def update_salary(
    submission_id: int,
    data: SalarySubmissionUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    s = db.query(SalarySubmission).filter(SalarySubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(s, field, value)
    db.commit()
    return {"message": "updated"}


@router.post("/salary-submissions/{submission_id}/approve")
def approve_salary(submission_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    s = db.query(SalarySubmission).filter(SalarySubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_approved = True
    db.commit()
    return {"message": "approved"}


@router.post("/salary-submissions/{submission_id}/unapprove")
def unapprove_salary(submission_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    s = db.query(SalarySubmission).filter(SalarySubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_approved = False
    db.commit()
    return {"message": "unapproved"}


@router.delete("/salary-submissions/{submission_id}")
def delete_salary(submission_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    s = db.query(SalarySubmission).filter(SalarySubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(s)
    db.commit()
    return {"message": "deleted"}


# --- Interview submissions ---

@router.get("/interview-submissions", response_model=List[InterviewSubmissionAdmin])
def list_all_interview(db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    rows = (
        db.query(InterviewSubmission, Company.name)
        .join(Company, InterviewSubmission.company_id == Company.id)
        .order_by(InterviewSubmission.is_approved, InterviewSubmission.created_at.desc())
        .all()
    )
    return [
        InterviewSubmissionAdmin(
            **{c.name: getattr(sub, c.name) for c in InterviewSubmission.__table__.columns if c.name != "created_at"},
            company_name=name,
            created_at=str(sub.created_at),
        )
        for sub, name in rows
    ]


@router.patch("/interview-submissions/{submission_id}")
def update_interview(
    submission_id: int,
    data: InterviewSubmissionUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    s = db.query(InterviewSubmission).filter(InterviewSubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(s, field, value)
    db.commit()
    return {"message": "updated"}


@router.post("/interview-submissions/{submission_id}/approve")
def approve_interview(submission_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    s = db.query(InterviewSubmission).filter(InterviewSubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_approved = True
    db.commit()
    return {"message": "approved"}


@router.post("/interview-submissions/{submission_id}/unapprove")
def unapprove_interview(submission_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    s = db.query(InterviewSubmission).filter(InterviewSubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_approved = False
    db.commit()
    return {"message": "unapproved"}


@router.delete("/interview-submissions/{submission_id}")
def delete_interview(submission_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    s = db.query(InterviewSubmission).filter(InterviewSubmission.id == submission_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(s)
    db.commit()
    return {"message": "deleted"}


# --- Companies ---

@router.get("/companies", response_model=List[CompanyRead])
def list_all_companies(db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    return db.query(Company).order_by(Company.is_approved, Company.name).all()


@router.patch("/companies/{company_id}", response_model=CompanyRead)
def update_company(company_id: int, data: CompanyUpdate, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company


@router.post("/companies/{company_id}/approve", response_model=CompanyRead)
def approve_company(company_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    company.is_approved = True
    db.commit()
    db.refresh(company)
    return company


@router.delete("/companies/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(company)
    db.commit()
    return {"message": "deleted"}


@router.post("/companies", response_model=CompanyRead)
def create_company_admin(data: CompanyCreate, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    company = Company(**data.model_dump(), is_approved=True)
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


# --- Articles ---

@router.get("/articles", response_model=List[ArticleRead])
def list_articles(db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    return db.query(Article).order_by(Article.created_at.desc()).all()


@router.post("/articles", response_model=ArticleRead)
def create_article(data: ArticleCreate, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    existing = db.query(Article).filter(Article.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    article = Article(**data.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.delete("/articles/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(article)
    db.commit()
    return {"message": "deleted"}


# --- Contacts ---

class ContactRead(BaseModel):
    id: int
    category: str
    email: Optional[str] = None
    message: str
    is_resolved: bool
    created_at: str

    model_config = {"from_attributes": True}


@router.get("/contacts", response_model=List[ContactRead])
def list_contacts(db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    rows = db.query(Contact).order_by(Contact.is_resolved, Contact.created_at.desc()).all()
    return [ContactRead(id=c.id, category=c.category, email=c.email, message=c.message, is_resolved=c.is_resolved, created_at=str(c.created_at)) for c in rows]


@router.post("/contacts/{contact_id}/resolve")
def resolve_contact(contact_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    c = db.query(Contact).filter(Contact.id == contact_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    c.is_resolved = True
    db.commit()
    return {"message": "resolved"}


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db), _: None = Depends(verify_admin)):
    c = db.query(Contact).filter(Contact.id == contact_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(c)
    db.commit()
    return {"message": "deleted"}
