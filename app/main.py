from fastapi import FastAPI

from app.database.base import Base
from app.database.database import engine
from app.models.plant import Plant  # importa para registrar o model

app = FastAPI(title="Sistema de Irrigação Inteligente")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "Backend rodando com sucesso 🚀"}
