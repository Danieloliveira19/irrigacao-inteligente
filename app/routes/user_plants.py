from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user import User
from app.models.plant_catalog import PlantCatalog
from app.models.plant_stage_template import PlantStageTemplate
from app.models.user_plant import UserPlant
from app.models.irrigation_rule import IrrigationRule

from app.schemas.user_plant import (
    AddPlantFromCatalog,
    AddCustomPlant,
    UpdatePlantStage,
    UserPlantResponse,
)
from app.schemas.irrigation_rule import EvaluateRequest

router = APIRouter(prefix="/users", tags=["User Plants"])


@router.get("/{user_id}/plants", response_model=list[UserPlantResponse])
def list_user_plants(user_id: int, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return db.query(UserPlant).filter(UserPlant.user_id == user_id).all()


@router.post("/{user_id}/plants/from-catalog", response_model=UserPlantResponse)
def add_from_catalog(user_id: int, payload: AddPlantFromCatalog, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    catalog = db.query(PlantCatalog).filter(PlantCatalog.id == payload.plant_catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="Planta do catálogo não encontrada")

    # cria planta do usuário já com uma fase padrão
    user_plant = UserPlant(user_id=user_id, plant_catalog_id=catalog.id, custom_name=None, stage="DEVELOPMENT")
    db.add(user_plant)
    db.commit()
    db.refresh(user_plant)

    # pega template da fase
    tpl = (
        db.query(PlantStageTemplate)
        .filter(
            PlantStageTemplate.plant_catalog_id == catalog.id,
            PlantStageTemplate.stage == user_plant.stage,
        )
        .first()
    )

    # fallback caso não exista template
    threshold = tpl.threshold_percent if tpl else catalog.default_threshold_percent
    duration = tpl.duration_minutes if tpl else catalog.default_duration_minutes
    interval = tpl.min_interval_minutes if tpl else catalog.default_min_interval_minutes

    rule = IrrigationRule(
        user_plant_id=user_plant.id,
        threshold_percent=threshold,
        duration_minutes=duration,
        min_interval_minutes=interval,
        enabled=True,
    )
    db.add(rule)
    db.commit()

    return user_plant


@router.post("/{user_id}/plants/custom", response_model=UserPlantResponse)
def add_custom(user_id: int, payload: AddCustomPlant, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    user_plant = UserPlant(user_id=user_id, plant_catalog_id=None, custom_name=payload.custom_name, stage="DEVELOPMENT")
    db.add(user_plant)
    db.commit()
    db.refresh(user_plant)

    rule = IrrigationRule(
        user_plant_id=user_plant.id,
        threshold_percent=payload.threshold_percent,
        duration_minutes=payload.duration_minutes,
        min_interval_minutes=payload.min_interval_minutes,
        enabled=True,
    )
    db.add(rule)
    db.commit()

    return user_plant


@router.put("/{user_id}/plants/{user_plant_id}/stage", response_model=UserPlantResponse)
def update_stage(user_id: int, user_plant_id: int, payload: UpdatePlantStage, db: Session = Depends(get_db)):
    plant = db.query(UserPlant).filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Planta do usuário não encontrada")

    plant.stage = payload.stage
    db.commit()
    db.refresh(plant)

    # se a planta veio do catálogo, atualiza a regra com base no template da fase
    if plant.plant_catalog_id:
        tpl = (
            db.query(PlantStageTemplate)
            .filter(
                PlantStageTemplate.plant_catalog_id == plant.plant_catalog_id,
                PlantStageTemplate.stage == plant.stage,
            )
            .first()
        )
        if tpl:
            rule = db.query(IrrigationRule).filter(IrrigationRule.user_plant_id == plant.id).first()
            if rule:
                rule.threshold_percent = tpl.threshold_percent
                rule.duration_minutes = tpl.duration_minutes
                rule.min_interval_minutes = tpl.min_interval_minutes
                db.commit()

    return plant


@router.post("/{user_id}/plants/{user_plant_id}/evaluate")
def evaluate_rule(user_id: int, user_plant_id: int, payload: EvaluateRequest, db: Session = Depends(get_db)):
    plant = db.query(UserPlant).filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Planta do usuário não encontrada")

    rule = db.query(IrrigationRule).filter(IrrigationRule.user_plant_id == plant.id).first()
    if not rule or not rule.enabled:
        return {"should_irrigate": False, "reason": "Regra inexistente ou desativada"}

    should = payload.current_moisture_percent < rule.threshold_percent
    return {
        "should_irrigate": should,
        "stage": plant.stage,
        "current_moisture_percent": payload.current_moisture_percent,
        "threshold_percent": rule.threshold_percent,
        "duration_minutes": rule.duration_minutes if should else 0,
    }
