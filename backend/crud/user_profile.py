# app/crud/user_profile.py
from sqlalchemy.orm import Session
from backend.models.user_profile import UserProfile
from backend.schemas.user_profile import (
    UserProfileCreate,
    UserProfileUpdate,
)


def get_profile_by_user_id(
    db: Session,
    user_id: int,
) -> UserProfile | None:
    return (
        db.query(UserProfile)
        .filter(UserProfile.user_id == user_id)
        .first()
    )


def create_profile(
    db: Session,
    user_id: int,
    profile_in: UserProfileCreate,
) -> UserProfile:
    db_profile = UserProfile(
        user_id=user_id,
        experience_years=profile_in.experience_years,
        english_level=profile_in.english_level,
        target_level=profile_in.target_level,
        interview_weaknesses=profile_in.interview_weaknesses,
    )

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def update_profile(
    db: Session,
    db_profile: UserProfile,
    profile_in: UserProfileUpdate,
) -> UserProfile:
    for key, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)
    return db_profile
