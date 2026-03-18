from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import companies, submissions, articles, admin
from alembic.config import Config
from alembic import command
import os

Base.metadata.create_all(bind=engine)

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))
command.upgrade(alembic_cfg, "head")

app = FastAPI(title="DevPay API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companies.router, prefix="/companies", tags=["companies"])
app.include_router(submissions.router, tags=["submissions"])
app.include_router(articles.router, prefix="/articles", tags=["articles"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/health")
def health():
    return {"status": "ok"}
