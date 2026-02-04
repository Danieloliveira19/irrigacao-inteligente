from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.database import engine

# IMPORTA MODELS para garantir que o SQLAlchemy "enxerga" tudo antes do create_all
from app.models.user import User  # noqa: F401
from app.models.plant_catalog import PlantCatalog  # noqa: F401
from app.models.plant import Plant  # noqa: F401
from app.models.user_plant import UserPlant  # noqa: F401
from app.models.irrigation_rule import IrrigationRule  # noqa: F401
from app.models.sensor import SensorReading  # noqa: F401
from app.models.irrigation_event import IrrigationEvent  # noqa: F401

# Routers
from app.routes.users import router as users_router
from app.routes.plant_catalog import router as plant_catalog_router
from app.routes.user_plants import router as user_plants_router
from app.routes.irrigation_rules import router as irrigation_rules_router
from app.routes.sensor import router as sensor_router
from app.routes.irrigation_engine import router as irrigation_engine_router
from app.routes.irrigation_events import router as irrigation_events_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(title="Sistema de Irrigação Inteligente", version="1.0.0")

# Ajuste: CORS correto (sem "*") para não dar conflito com credentials
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.0.9:3000",
    "http://192.168.0.11:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def health():
    return {"status": "ok"}

app.include_router(users_router)
app.include_router(plant_catalog_router)
app.include_router(user_plants_router)
app.include_router(irrigation_rules_router)
app.include_router(sensor_router)
app.include_router(irrigation_engine_router)
app.include_router(irrigation_events_router)
app.include_router(dashboard_router)
