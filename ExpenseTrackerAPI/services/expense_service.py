from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

import models, schemas

def create_expense(db: Session, expense: schemas.ExpenseCreate, user):
    db_expense = models.Expense(name=expense.name, amount=expense.amount, date=expense.date, category_id=expense.category_id, owner_id=user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, user):
    return db.query(models.Expense).filter(models.Expense.owner_id == user.id).all()

def delete_expense_by_id(id: int, db:Session, user):
    expense = db.query(models.Expense).filter(models.Expense.id == id, models.Expense.owner_id == user.id).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return expense

def get_category_expense_sums(db: Session, user):
    results = (
        db.query(models.Category.name, func.sum(models.Expense.amount).label("total"))
          .join(models.Expense, models.Expense.category_id == models.Category.id)
          .filter(models.Expense.owner_id == user.id)
          .group_by(models.Category.id)
          .all()
    )

    return [{"category": name.split(" ")[1], "sum": total} for name, total in results]

def get_total_sum(db:Session, user):
    total = db.query(func.sum(models.Expense.amount).label("total")).filter(models.Expense.owner_id == user.id).scalar()
    return total or 0

def get_top_category(db: Session, user):
    result = (
        db.query(models.Category.name, func.sum(models.Expense.amount).label("total"))
          .join(models.Expense, models.Expense.category_id == models.Category.id)
          .filter(models.Expense.owner_id == user.id)
          .group_by(models.Category.id)
          .order_by(func.sum(models.Expense.amount).desc())
          .first()
    )
    if result:
        name, total = result
        parts = name.split(" ", 1)
        icon = parts[0]
        text = parts[1] if len(parts) > 1 else ""
        return {"icon": icon, "category": text, "sum": float(total)}
    else:
        return {"icon": "", "category": "", "sum": 0.0}