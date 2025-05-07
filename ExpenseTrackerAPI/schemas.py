from datetime import date
from typing import Optional
from pydantic import BaseModel

class CategorySchema(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}

class CategoryCreate(BaseModel):
    name: str

class ExpenseCreate(BaseModel):
    name: str
    amount: float
    date: date
    category_id: int

class ExpenseSchema(ExpenseCreate):
    id: int
    owner_id: int

    model_config = {"from_attributes": True}

class CategoryExpenseSum(BaseModel):
    category: str
    sum: float

class TopCategory(BaseModel):
    icon: str
    category: str
    sum: float

class UserCreate(BaseModel):
    username: str
    password: str

class UserSchema(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None