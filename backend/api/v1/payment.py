from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.api.deps import get_db, get_current_user
from backend.schemas.payment import PaymentCreate, PaymentResponse, PaymentUpdate
from backend.crud import payment as crud_payment

router = APIRouter()

# ============================================================
# 支払い作成（ユーザー）
# ============================================================
@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud_payment.create_payment(
        db=db,
        user_id=current_user.id,
        payment_in=payment_in
    )

# ============================================================
# 支払いステータス取得
# ============================================================
@router.get("/{interview_id}", response_model=PaymentResponse)
def get_payment_status(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    payment = crud_payment.get_payment_by_interview(db, interview_id)

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # 権限チェック: 支払いユーザー or 面接官
    if payment.user_id != current_user.id and getattr(current_user, "role", None) != "interviewer":
        raise HTTPException(status_code=403, detail="Not authorized")

    return payment

# ============================================================
# 支払いステータス更新（決済Webhook想定）
# ============================================================
@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment_status(
    payment_id: int,
    payment_in: PaymentUpdate,
    db: Session = Depends(get_db)
):
    payment = crud_payment.get_payment(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return crud_payment.update_payment(db, payment, payment_in)