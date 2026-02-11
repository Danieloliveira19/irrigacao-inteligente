# app/routes/user_plants.py
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.plant_catalog import PlantCatalog
from app.models.plant import Plant
from app.models.irrigation_rule import IrrigationRule
from app.models.irrigation_event import IrrigationEvent

from app.schemas.user_plant import (
    UserPlantOut,
    AddFromCatalogIn,
    AddCustomPlantIn,
    UpdateStageIn,
)
from app.schemas.user_plant_read import UserPlantRead

router = APIRouter(prefix="/users/{user_id}/plants", tags=["User Plants"])


@router.get("/", response_model=list[UserPlantRead])
def list_user_plants(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna uma lista pronta pro frontend:
    - user_plant_id
    - user_id
    - plant_name
    - stage
    - status (OK | NEEDS_WATER | ALERT)
    - last_irrigation_at
    """
    rows = (
        db.query(UserPlant, PlantCatalog)
        .join(PlantCatalog, UserPlant.catalog_id == PlantCatalog.id)
        .filter(UserPlant.user_id == user_id)
        .all()
    )

    result: list[UserPlantRead] = []

    for up, catalog in rows:
        last_event = (
            db.query(IrrigationEvent)
            .filter(IrrigationEvent.user_plant_id == up.id)
            .order_by(IrrigationEvent.created_at.desc())
            .first()
        )

        # status: tenta usar o campo needs_water se existir no model
        status = "OK"
        if last_event is not None and getattr(last_event, "needs_water", False):
            status = "NEEDS_WATER"

        result.append(
            UserPlantRead(
                user_plant_id=up.id,
                user_id=up.user_id,
                plant_name=catalog.name,
                stage=(up.stage or "").upper(),
                status=status,
                last_irrigation_at=(last_event.created_at if last_event else None),
            )
        )

    return result


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
    up = (
        db.query(UserPlant)
        .filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id)
        .first()
    )
    if not up:
        raise HTTPException(status_code=404, detail="User plant not found")

    up.stage = payload.stage
    db.commit()
    db.refresh(up)
    return up
