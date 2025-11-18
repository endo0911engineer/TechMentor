from fastapi import FastAPI
from backend.core.database import Base, engine
import backend.models 
from backend.api.v1.router import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview Matching Service", version="0.1.0")

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Interview Service API is running"}