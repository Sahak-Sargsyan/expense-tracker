from fastapi import FastAPI
from database import engine
from routers import expense_router, category_router, auth_router
from fastapi.middleware.cors import CORSMiddleware
import models
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Allows these origins
    allow_credentials=True,
    allow_methods=["*"],        # Allows all HTTP methods
    allow_headers=["*"],        # Allows all headers
)

models.Base.metadata.create_all(bind=engine)

app.include_router(expense_router.router, prefix="/expenses", tags=["Expenses"])
app.include_router(category_router.router, prefix="/categories", tags=["Categories"])
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])

def seed_categories(db: Session):
    default_categories = [
        "🍔 Food",
        "📱 Electronics",
        "🚗 Transportation",
        "✈️ Travel",
        "🎮 Entertainment",
        "💡 Utilities",
        "👨‍⚕️ Healthcare",
        "👤 Personal",
        "📚 Education",
        "📦 Other"
    ]

    if db.query(models.Category).count() == 0:
        for cat in default_categories:
            new_cat = models.Category(name=cat)
            db.add(new_cat)
        db.commit()
        print("Default categories seeded.")
    else:
        print("Categories already exist.")

if __name__ == "__main__":
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_categories(db)
    finally:
        db.close()

    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
