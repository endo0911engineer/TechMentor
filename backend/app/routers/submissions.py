from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.limiter import limiter
from app.models.submission import SalarySubmission, InterviewSubmission
from app.models.company import Company
from app.schemas.submission import (
    SalarySubmissionCreate,
    SalarySubmissionRead,
    InterviewSubmissionCreate,
    InterviewSubmissionRead,
    InterviewSubmissionWithCompany,
)
import os
import json
import urllib.request
import urllib.parse

router = APIRouter()


def _verify_recaptcha(token: str | None) -> None:
    """reCAPTCHA v3 トークンを検証する。RECAPTCHA_SECRET_KEY 未設定時はスキップ（開発環境）。"""
    secret = os.getenv("RECAPTCHA_SECRET_KEY", "")
    if not secret:
        return  # 開発環境ではスキップ
    if not token:
        raise HTTPException(status_code=400, detail="reCAPTCHA トークンが必要です")
    try:
        data = urllib.parse.urlencode({"secret": secret, "response": token}).encode()
        with urllib.request.urlopen(
            "https://www.google.com/recaptcha/api/siteverify", data=data, timeout=5
        ) as resp:
            result = json.loads(resp.read())
    except Exception:
        raise HTTPException(status_code=500, detail="reCAPTCHA 検証に失敗しました")
    if not result.get("success") or result.get("score", 0) < 0.5:
        raise HTTPException(status_code=400, detail="reCAPTCHA 検証に失敗しました")


@router.post("/salary-submissions", response_model=SalarySubmissionRead, status_code=201)
@limiter.limit("50/hour")
def create_salary_submission(
    request: Request, data: SalarySubmissionCreate, db: Session = Depends(get_db)
):
    _verify_recaptcha(data.recaptcha_token)
    submission = SalarySubmission(**data.model_dump(exclude={"recaptcha_token"}))
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.post("/interview-submissions", response_model=InterviewSubmissionRead, status_code=201)
@limiter.limit("50/hour")
def create_interview_submission(
    request: Request, data: InterviewSubmissionCreate, db: Session = Depends(get_db)
):
    _verify_recaptcha(data.recaptcha_token)
    submission = InterviewSubmission(**data.model_dump(exclude={"recaptcha_token"}))
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
