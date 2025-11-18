# backend/utils/meet.py
import uuid

def generate_meet_url() -> str:
    code = uuid.uuid4().hex[:10]
    return f"https://meet.google.com/{code}"
