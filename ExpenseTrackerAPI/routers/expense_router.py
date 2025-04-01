from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from services import expense_service
import schemas
from utilities.dependencies import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ExpenseSchema)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return expense_service.create_expense(db, expense, current_user)

@router.get("/", response_model=list[schemas.ExpenseSchema])
def read_expenses(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return expense_service.get_expenses(db, current_user)

@router.delete("/{id}/", response_model=schemas.ExpenseSchema)
def delete_expense_by_id(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return expense_service.delete_expense_by_id(id, db, current_user)

@router.get("/category-sum/", response_model=list[schemas.CategoryExpenseSum])
def get_category_expense_sums(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return expense_service.get_category_expense_sums(db, current_user)

@router.get("/sum/", response_model=float)
def get_expense_total(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return expense_service.get_total_sum(db, current_user)

@router.get("/top-category", response_model=schemas.TopCategory)
def read_top_category(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return expense_service.get_top_category(db, current_user)
