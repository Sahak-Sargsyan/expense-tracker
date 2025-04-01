from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from services import category_service
import models
import schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.CategorySchema)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return category_service.create_category(db, category)

@router.get("/", response_model=list[schemas.CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    return category_service.get_categories(db)

@router.get("/{id}", response_model=schemas.CategorySchema)
def get_category_by_id(id: int, db: Session = Depends(get_db)):
    return category_service.get_category_by_id(id, db)
