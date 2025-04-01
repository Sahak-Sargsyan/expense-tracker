from fastapi import FastAPI
from database import engine
from routers import expense_router, category_router, auth_router
from fastapi.middleware.cors import CORSMiddleware
import models

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
