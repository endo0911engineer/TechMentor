from fastapi import APIRouter
from backend.api.v1 import user, interviewer, interview, feedback, payment, reward, schedule

api_router = APIRouter()

api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(interviewer.router, prefix="/interviewers", tags=["interviewers"])
api_router.include_router(interview.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(feedback.router, prefix="/feedbacks", tags=["feedbacks"])
api_router.include_router(payment.router, prefix="/payments", tags=["payments"])
api_router.include_router(reward.router, prefix="/rewards", tags=["rewards"])
api_router.include_router(schedule.router, prefix="/schedules", tags=["schedules"])
