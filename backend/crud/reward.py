# app/crud/reward.py
from sqlalchemy.orm import Session
from backend.models.reward import Reward
from typing import List

def get_reward(db: Session, reward_id: int) -> Reward | None:
    return db.query(Reward).filter(Reward.id == reward_id).first()

def get_rewards_by_interviewer(db: Session, interviewer_id: int) -> List[Reward]:
    return db.query(Reward).filter(Reward.interviewer_id == interviewer_id).all()

def create_reward(db: Session, reward_data: dict) -> Reward:
    db_reward = Reward(**reward_data)
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward

def update_reward(db: Session, db_reward: Reward, update_data: dict) -> Reward:
    for key, value in update_data.items():
        setattr(db_reward, key, value)
    db.commit()
    db.refresh(db_reward)
    return db_reward

def delete_reward(db: Session, db_reward: Reward) -> None:
    db.delete(db_reward)
    db.commit()
