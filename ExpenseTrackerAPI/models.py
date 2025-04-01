from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    expenses = relationship("Expense", back_populates="owner")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    amount = Column(Float)
    date = Column(Date)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="expenses")
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="expenses")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)

    expenses = relationship("Expense", back_populates="category")