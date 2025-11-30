# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.database import Base, engine
from backend.api.router import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview Matching Service", version="0.1.0")

origins = [
    # 開発環境でフロントエンドが動作しているURLを許可
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Dockerネットワーク経由でのアクセスも念のため許可
    "http://frontend:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,                     # 許可するオリジンのリスト
    allow_credentials=True,                    # クッキーなどの資格情報の送信を許可
    allow_methods=["*"],                       # すべてのHTTPメソッド (GET, POST, OPTIONS など) を許可
    allow_headers=["*"],                       # すべてのヘッダーを許可
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Interview Service API is running"}