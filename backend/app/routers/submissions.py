from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.submission import SalarySubmission, InterviewSubmission
from app.models.company import Company
from app.schemas.submission import (
    SalarySubmissionCreate,
    SalarySubmissionRead,
    InterviewSubmissionCreate,
    InterviewSubmissionRead,
    InterviewSubmissionWithCompany,
)

router = APIRouter()


@router.post("/salary-submissions", response_model=SalarySubmissionRead, status_code=201)
def create_salary_submission(
    data: SalarySubmissionCreate, db: Session = Depends(get_db)
):
    submission = SalarySubmission(**data.model_dump())
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.post("/interview-submissions", response_model=InterviewSubmissionRead, status_code=201)
def create_interview_submission(
    data: InterviewSubmissionCreate, db: Session = Depends(get_db)
):
    submission = InterviewSubmission(**data.model_dump())
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/interview-submissions", response_model=List[InterviewSubmissionWithCompany])
def list_interview_submissions(db: Session = Depends(get_db)):
    rows = (
        db.query(InterviewSubmission, Company.name)
        .join(Company, InterviewSubmission.company_id == Company.id)
        .filter(InterviewSubmission.is_approved == True)
        .order_by(InterviewSubmission.created_at.desc())
        .all()
    )
    return [
        InterviewSubmissionWithCompany(**sub.__dict__, company_name=name)
        for sub, name in rows
    ]


@router.get("/interview-submissions/{submission_id}", response_model=InterviewSubmissionRead)
def get_interview_submission(submission_id: int, db: Session = Depends(get_db)):
    submission = (
        db.query(InterviewSubmission)
        .filter(InterviewSubmission.id == submission_id, InterviewSubmission.is_approved == True)
        .first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Interview submission not found")
    return submission
