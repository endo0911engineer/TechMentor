# app/crud/experience.py
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from backend.models.experience import Experience

# 取得

def get_experience(
    db: Session,
    experience_id: int
) -> Optional[Experience]:
    return db.query(Experience).filter(Experience.id == experience_id).first()


def get_experiences_by_user(
    db: Session,
    user_id: int
) -> List[Experience]:
    return (
        db.query(Experience)
        .filter(Experience.user_id == user_id)
        .order_by(Experience.order.asc())
        .all()
    )

# 作成
def create_experience(
    db: Session,
    *,
    user_id: int,
    company: str,
    title: str,
    start_date: date,
    end_date: Optional[date],
    description: Optional[str],
    order: int,
) -> Experience:
    experience = Experience(
        user_id=user_id,
        company=company,
        title=title,
        start_date=start_date,
        end_date=end_date,
        description=description,
        order=order,
    )

    db.add(experience)
    db.commit()
    db.refresh(experience)
    return experience

# 更新
def update_experience(
    db: Session,
    db_experience: Experience,
    update_data: dict
) -> Experience:
    for key, value in update_data.items():
        setattr(db_experience, key, value)

    db.commit()
    db.refresh(db_experience)
    return db_experience


# 並び順変更
def reorder_experiences(
    db: Session,
    user_id: int,
    ordered_ids: List[int],
) -> None:
    """
    experiences の並び順をまとめて更新
    """
    experiences = (
        db.query(Experience)
        .filter(
            Experience.user_id == user_id,
            Experience.id.in_(ordered_ids),
        )
        .all()
    )

    id_to_exp = {exp.id: exp for exp in experiences}

    for index, exp_id in enumerate(ordered_ids):
        id_to_exp[exp_id].order = index

    db.commit()


# 削除
def delete_experience(
    db: Session,
    db_experience: Experience
) -> None:
    db.delete(db_experience)
    db.commit()