# backend/api/router.py
from fastapi import APIRouter
from backend.api.v1 import auth, interviewer_profiles, interviews, interviews_slots, user, feedback, payment, reward, schedule, user_profiles, experiences

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(user_profiles.router, prefix="/user-profile", tags=["user-profile"])
api_router.include_router(interviewer_profiles.router, prefix="/interviewer-profile", tags=["interviewer-profile"])
api_router.include_router(experiences.router, prefix="/experiences", tags=["experiences"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(interviews_slots.router, prefix="/interviews-slots", tags=["Interview Slots"])
api_router.include_router(feedback.router, prefix="/feedbacks", tags=["feedbacks"])
api_router.include_router(payment.router, prefix="/payments", tags=["payments"])
api_router.include_router(reward.router, prefix="/rewards", tags=["rewards"])
api_router.include_router(schedule.router, prefix="/schedules", tags=["schedules"])
api_router.include_router(user_profiles.router, prefix="/profile", tags=["profile"])