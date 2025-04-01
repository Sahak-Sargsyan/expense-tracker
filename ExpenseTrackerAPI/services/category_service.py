from fastapi import HTTPException

from sqlalchemy.orm import Session
import models, schemas


def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session):
    return db.query(models.Category).all()

def get_category_by_id(id: int, db: Session):
    category = db.query(models.Category).filter(models.Category.id == id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

def get_category_by_name(name: str, db: Session):
    category = db.query(models.Category).filter(models.Category.name == name).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
