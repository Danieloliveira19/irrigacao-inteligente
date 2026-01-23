from fastapi import FastAPI

from app.database.base import Base
from app.database.database import engine

# Models (OBRIGATÓRIO importar todos)
from app.models.plant import Plant
from app.models.irrigation_rule import IrrigationRule

# Routers
from app.routes.plants import router as plants_router
from app.routes.irrigation_rules import router as irrigation_rules_router


app = FastAPI(
    title="Sistema de Irrigação Inteligente",
    version="0.1.0",
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


app.include_router(plants_router)
app.include_router(irrigation_rules_router)


@app.get("/")
def root():
    return {"status": "Backend rodando com sucesso 🚀"}
