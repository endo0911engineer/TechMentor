# app/crud/payment.py
from sqlalchemy.orm import Session
from app.models.payment import Payment
from typing import List

def get_payment(db: Session, payment_id: int) -> Payment | None:
    return db.query(Payment).filter(Payment.id == payment_id).first()

def get_payments_by_user(db: Session, user_id: int) -> List[Payment]:
    return db.query(Payment).filter(Payment.user_id == user_id).all()

def create_payment(db: Session, payment_data: dict) -> Payment:
    db_payment = Payment(**payment_data)
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def update_payment(db: Session, db_payment: Payment, update_data: dict) -> Payment:
    for key, value in update_data.items():
        setattr(db_payment, key, value)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def delete_payment(db: Session, db_payment: Payment) -> None:
    db.delete(db_payment)
    db.commit()
