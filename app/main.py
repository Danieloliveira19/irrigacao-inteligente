from fastapi import FastAPI

from app.database.base import Base
from app.database.database import engine

from app.models.user import User  # noqa: F401
from app.models.plant_catalog import PlantCatalog  # noqa: F401
from app.models.plant_stage_template import PlantStageTemplate  # noqa: F401
from app.models.user_plant import UserPlant  # noqa: F401
from app.models.irrigation_rule import IrrigationRule  # noqa: F401

from app.routes.users import router as users_router
from app.routes.plant_catalog import router as plant_catalog_router
from app.routes.user_plants import router as user_plants_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Irrigação Inteligente")

app.include_router(users_router)
app.include_router(plant_catalog_router)
app.include_router(user_plants_router)
