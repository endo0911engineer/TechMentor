from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.routers import companies, submissions, articles, admin, industries
from app.models.company import Company
from app.models.submission import SalarySubmission, InterviewSubmission
from app.models.contact import Contact
from app.limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from alembic.config import Config
from alembic import command
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))
command.upgrade(alembic_cfg, "head")

app = FastAPI(title="DevPay API", version="1.0.0")

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

_origins = ["http://localhost:3000"]
if os.getenv("FRONTEND_ORIGIN"):
    _origins.append(os.getenv("FRONTEND_ORIGIN"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "リクエストが多すぎます。しばらく待ってから再試行してください。"},
    )

app.include_router(companies.router, prefix="/companies", tags=["companies"])
app.include_router(submissions.router, tags=["submissions"])
app.include_router(articles.router, prefix="/articles", tags=["articles"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(industries.router, prefix="/industries", tags=["industries"])


@app.get("/health")
def health():
    return {"status": "ok"}


class ContactCreate(BaseModel):
    category: str
    email: Optional[str] = None
    message: str


@app.post("/contacts", status_code=201)
@limiter.limit("20/hour")
def submit_contact(request: Request, data: ContactCreate, db: Session = Depends(get_db)):
    contact = Contact(category=data.category, email=data.email, message=data.message)
    db.add(contact)
    db.commit()
    return {"message": "submitted"}


@app.get("/stats")
def global_stats(db: Session = Depends(get_db)):
    company_count = db.query(Company).filter(Company.is_approved == True).count()
    salary_count = db.query(SalarySubmission).filter(SalarySubmission.is_approved == True).count()
    interview_count = db.query(InterviewSubmission).filter(InterviewSubmission.is_approved == True).count()
    return {
        "company_count": company_count,
        "salary_count": salary_count,
        "interview_count": interview_count,
    }
