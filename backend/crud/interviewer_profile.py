# app/crud/interviewer_profile.py
from sqlalchemy.orm import Session
from typing import Optional, List

from backend.models.interviewer_profile import InterviewerProfile
from backend.models.user import User

# 取得系
def get_interviewer_profile(
    db: Session,
    interviewer_profile_id: int
) -> Optional[InterviewerProfile]:
    return (
        db.query(InterviewerProfile)
        .filter(InterviewerProfile.id == interviewer_profile_id)
        .first()
    )

def get_interviewer_profile_by_user(
    db: Session,
    user_id: int
) -> Optional[InterviewerProfile]:
    return (
        db.query(InterviewerProfile)
        .filter(InterviewerProfile.user_id == user_id)
        .first()
    )


def get_all_interviewer_profiles(db: Session) -> List[InterviewerProfile]:
    return db.query(InterviewerProfile).all()

# 作成
def create_interviewer_profile(
    db: Session,
    *,
    user_id: int,
    current_company: str | None = None,
    current_title: str | None = None,
    years_of_interviewing: int | None = None,
    interview_style: str | None = None,
    strengths: str | None = None,
    bio: str | None = None,
    price_per_session: int | None = None,
    available_levels: str | None = None,
) -> InterviewerProfile:
    profile = InterviewerProfile(
        user_id=user_id,
        current_company=current_company,
        current_title=current_title,
        years_of_interviewing=years_of_interviewing,
        interview_style=interview_style,
        strengths=strengths,
        bio=bio,
        price_per_session=price_per_session,
        available_levels=available_levels,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

# 更新
def update_interviewer_profile(
    db: Session,
    db_profile: InterviewerProfile,
    update_data: dict
) -> InterviewerProfile:
    for key, value in update_data.items():
        setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)
    return db_profile

# 削除
def delete_interviewer_profile(
    db: Session,
    db_profile: InterviewerProfile
) -> None:
    db.delete(db_profile)
    db.commit()