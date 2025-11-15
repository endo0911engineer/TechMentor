# app/core/config.py
from pydantic import BaseSettings, PostgresDsn

class Settings(BaseSettings):
    # DB接続設定
    DATABASE_URL: PostgresDsn

    # JWT設定（後で使う）
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1日
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
