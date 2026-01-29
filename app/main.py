from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base

# IMPORTA MODELS para registrar no metadata
from app.models.user import User  # noqa
from app.models.plant_catalog import PlantCatalog  # noqa
from app.models.plant_stage_template import PlantStageTemplate  # noqa
from app.models.user_plant import UserPlant  # noqa
from app.models.irrigation_rule import IrrigationRule  # noqa
from app.models.irrigation_event import IrrigationEvent  # noqa

from app.routes.users import router as users_router
from app.routes.plant_catalog import router as catalog_router
from app.routes.user_plants import router as user_plants_router
from app.routes.irrigation_rules import router as rules_router
from app.routes.sensor import router as sensor_router
from app.routes.irrigation_events import router as events_router
from app.routes.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Irrigação Inteligente",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em produção, restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas (sem duplicar prefix!)
app.include_router(users_router)
app.include_router(catalog_router)
app.include_router(user_plants_router)
app.include_router(rules_router)
app.include_router(sensor_router)
app.include_router(events_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"status": "ok"}
