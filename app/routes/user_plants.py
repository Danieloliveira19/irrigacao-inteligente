from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.plant_catalog import PlantCatalog
from app.models.plant import Plant
from app.models.irrigation_rule import IrrigationRule
from app.schemas.user_plant import (
    UserPlantOut, AddFromCatalogIn, AddCustomPlantIn, UpdateStageIn
)

router = APIRouter(prefix="/users/{user_id}/plants", tags=["User Plants"])


@router.get("/", response_model=list[UserPlantOut])
def list_user_plants(user_id: int, db: Session = Depends(get_db)):
    return db.query(UserPlant).filter(UserPlant.user_id == user_id).all()


@router.post("/from-catalog", response_model=UserPlantOut)
def add_from_catalog(user_id: int, payload: AddFromCatalogIn, db: Session = Depends(get_db)):
    cat = db.query(PlantCatalog).filter(PlantCatalog.id == payload.catalog_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catalog plant not found")

    up = UserPlant(user_id=user_id, catalog_id=cat.id, stage="DEVELOPMENT")
    db.add(up)
    db.commit()
    db.refresh(up)

    # cria regra default para essa planta
    rule = IrrigationRule(
        user_plant_id=up.id,
        stage="DEVELOPMENT",
        threshold_percent=cat.default_threshold_percent,
        duration_minutes=cat.default_duration_minutes,
        min_interval_minutes=60,
        enabled=True,
    )
    db.add(rule)
    db.commit()

    return up


@router.post("/custom", response_model=UserPlantOut)
def add_custom(user_id: int, payload: AddCustomPlantIn, db: Session = Depends(get_db)):
    plant = Plant(
        name=payload.name,
        default_threshold_percent=payload.default_threshold_percent,
        default_duration_minutes=payload.default_duration_minutes,
    )
    db.add(plant)
    db.commit()
    db.refresh(plant)

    up = UserPlant(user_id=user_id, plant_id=plant.id, stage="DEVELOPMENT")
    db.add(up)
    db.commit()
    db.refresh(up)

    rule = IrrigationRule(
        user_plant_id=up.id,
        stage="DEVELOPMENT",
        threshold_percent=plant.default_threshold_percent,
        duration_minutes=plant.default_duration_minutes,
        min_interval_minutes=60,
        enabled=True,
    )
    db.add(rule)
    db.commit()

    return up


@router.put("/{user_plant_id}/stage", response_model=UserPlantOut)
def update_stage(user_id: int, user_plant_id: int, payload: UpdateStageIn, db: Session = Depends(get_db)):
    up = db.query(UserPlant).filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id).first()
    if not up:
        raise HTTPException(status_code=404, detail="User plant not found")

    up.stage = payload.stage
    db.commit()
    db.refresh(up)
    return up
