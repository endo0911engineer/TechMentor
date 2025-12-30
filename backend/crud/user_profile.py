# app/crud/user_profile.py
from sqlalchemy.orm import Session

from backend.models.user_profile import UserProfile
from backend.models.skill import UserSkill
from backend.schemas.user_profile import (
    UserProfileCreate,
    UserProfileUpdate,
)

def get_by_user_id(
    db: Session,
    user_id: int,
) -> UserProfile | None:
    return (
        db.query(UserProfile)
        .filter(UserProfile.user_id == user_id)
        .first()
    )


def create(
    db: Session,
    user_id: int,
    profile_in: UserProfileCreate,
) -> UserProfile:
    profile = UserProfile(
        user_id=user_id,
        experience_years=profile_in.experience_years,
        english_level=profile_in.english_level,
        target_level=profile_in.target_level,
        interview_weaknesses=profile_in.interview_weaknesses,
    )

    db.add(profile)
    db.flush()  # id を確定させる（skills 用）

    # skills 登録
    if profile_in.skills:
        profile.skills = [
            UserSkill(
                user_id=user_id,
                skill_id=skill.skill_id,
                level=skill.level,
            )
            for skill in profile_in.skills
        ]

    db.commit()
    db.refresh(profile)
    return profile


def update(
    db: Session,
    profile: UserProfile,
    profile_in: UserProfileUpdate,
) -> UserProfile:
    data = profile_in.model_dump(exclude_unset=True)

    # 通常フィールド更新
    for field in [
        "experience_years",
        "english_level",
        "target_level",
        "interview_weaknesses",
    ]:
        if field in data:
            setattr(profile, field, data[field])

    # skills 更新（全置換）
    if "skills" in data:
        profile.skills.clear()

        profile.skills.extend(
            UserSkill(
                user_id=profile.user_id,
                skill_id=skill.skill_id,
                level=skill.level,
            )
            for skill in data["skills"]
        )

    db.commit()
    db.refresh(profile)
    return profile