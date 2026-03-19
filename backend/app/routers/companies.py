from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.company import Company
from app.models.submission import SalarySubmission, InterviewSubmission
from app.schemas.company import CompanyRead, CompanyCreate, CompanyStats
from app.schemas.submission import SalarySubmissionRead, InterviewSubmissionRead
from app.services.stats import calculate_salary_stats

router = APIRouter()


@router.post("", response_model=CompanyRead, status_code=201)
def create_company(data: CompanyCreate, db: Session = Depends(get_db)):
    existing = db.query(Company).filter(Company.name == data.name).first()
    if existing:
        return existing
    company = Company(**data.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company



@router.get("/tech-stacks", response_model=List[str])
def list_tech_stacks(db: Session = Depends(get_db)):
    rows = (
        db.query(SalarySubmission.tech_stack)
        .filter(SalarySubmission.is_approved == True, SalarySubmission.tech_stack.isnot(None))
        .all()
    )
    stacks = set()
    for (ts,) in rows:
        for t in ts.split(","):
            t = t.strip()
            if t:
                stacks.add(t)
    return sorted(stacks)


@router.get("", response_model=List[CompanyRead])
def list_companies(
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    tech_stack: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Company).filter(Company.is_approved == True)
    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    if industry:
        query = query.filter(Company.industry == industry)
    if tech_stack:
        from sqlalchemy import exists
        sub = (
            exists()
            .where(SalarySubmission.company_id == Company.id)
            .where(SalarySubmission.is_approved == True)
            .where(SalarySubmission.tech_stack.ilike(f"%{tech_stack}%"))
        )
        query = query.filter(sub)
    return query.offset(skip).limit(limit).all()


@router.get("/{company_id}", response_model=CompanyRead)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id, Company.is_approved == True).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.get("/{company_id}/stats", response_model=CompanyStats)
def get_company_stats(company_id: int, db: Session = Depends(get_db)):
    submissions = (
        db.query(SalarySubmission)
        .filter(
            SalarySubmission.company_id == company_id,
            SalarySubmission.is_approved == True,
        )
        .all()
    )
    return calculate_salary_stats(submissions)


@router.get("/{company_id}/salary-submissions", response_model=List[SalarySubmissionRead])
def get_salary_submissions(company_id: int, db: Session = Depends(get_db)):
    return (
        db.query(SalarySubmission)
        .filter(
            SalarySubmission.company_id == company_id,
            SalarySubmission.is_approved == True,
        )
        .order_by(SalarySubmission.created_at.desc())
        .all()
    )


@router.get("/{company_id}/interview-submissions", response_model=List[InterviewSubmissionRead])
def get_interview_submissions(company_id: int, db: Session = Depends(get_db)):
    return (
        db.query(InterviewSubmission)
        .filter(
            InterviewSubmission.company_id == company_id,
            InterviewSubmission.is_approved == True,
        )
        .order_by(InterviewSubmission.created_at.desc())
        .all()
    )
