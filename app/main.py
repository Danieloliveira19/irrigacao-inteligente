from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base

# 🔥 IMPORTA OS MODELS PARA REGISTRAR AS TABELAS NO Base.metadata (ESSENCIAL)
from app.models import (  # noqa: F401
    user,
    plant,
    user_plant,
    plant_catalog,
    plant_stage_template,
    irrigation_rule,
    irrigation_event,
)

from app.routes import (
    users,
    user_plants,
    plant_catalog as plant_catalog_routes,
    irrigation_rules,
    sensor,
    dashboard,
    irrigation_events,
)

app = FastAPI(title="Sistema de Irrigação Inteligente", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # depois você restringe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# cria tabelas (AGORA com models registrados)
Base.metadata.create_all(bind=engine)

# rotas (sem prefix duplicado)
app.include_router(users.router)
app.include_router(user_plants.router)
app.include_router(plant_catalog_routes.router)
app.include_router(irrigation_rules.router)
app.include_router(sensor.router)
app.include_router(dashboard.router)
app.include_router(irrigation_events.router)
