from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.plant_catalog import PlantCatalog
from app.models.plant_stage_template import PlantStageTemplate
from app.models.irrigation_rule import IrrigationRule
from app.models.irrigation_event import IrrigationEvent
from app.schemas.sensor import SensorReadingRequest, SensorReadingResponse

router = APIRouter(prefix="/users/{user_id}/plants/{user_plant_id}", tags=["Sensor"])


def _get_custom_rule(db: Session, user_plant_id: int, stage: str):
    return (
        db.query(IrrigationRule)
        .filter(
            IrrigationRule.user_plant_id == user_plant_id,
            IrrigationRule.stage == stage,
            IrrigationRule.is_custom == True,  # noqa: E712
        )
        .order_by(IrrigationRule.id.desc())
        .first()
    )


def _get_stage_template(db: Session, plant_catalog_id: int, stage: str):
    return (
        db.query(PlantStageTemplate)
        .filter(
            PlantStageTemplate.plant_catalog_id == plant_catalog_id,
            PlantStageTemplate.stage == stage,
        )
        .first()
    )


@router.post("/sensor-reading", response_model=SensorReadingResponse)
def sensor_reading(
    user_id: int,
    user_plant_id: int,
    payload: SensorReadingRequest,
    db: Session = Depends(get_db),
):
    plant = (
        db.query(UserPlant)
        .filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id)
        .first()
    )
    if not plant:
        raise HTTPException(status_code=404, detail="Planta do usuário não encontrada")

    stage = plant.stage

    # 1) Regra custom
    custom = _get_custom_rule(db, user_plant_id=user_plant_id, stage=stage)
    if custom:
        threshold = float(custom.threshold_percent)
        duration = int(custom.duration_minutes)
        min_interval = int(custom.min_interval_minutes)
        rule_source = "CUSTOM_RULE"
        note = "Regra personalizada aplicada (custom)."
    else:
        # precisa ter catálogo para template/default
        if not plant.plant_catalog_id:
            raise HTTPException(
                status_code=400,
                detail="Planta custom sem catálogo: crie uma regra custom para esta fase.",
            )

        # 2) Template por fase do catálogo
        template = _get_stage_template(
            db, plant_catalog_id=plant.plant_catalog_id, stage=stage
        )
        if template:
            threshold = float(template.threshold_percent)
            duration = int(template.duration_minutes)
            min_interval = int(template.min_interval_minutes)
            rule_source = "STAGE_TEMPLATE"
            note = "Template do catálogo aplicado (por fase)."
        else:
            # 3) Default do catálogo
            catalog = (
                db.query(PlantCatalog)
                .filter(PlantCatalog.id == plant.plant_catalog_id)
                .first()
            )
            if not catalog:
                raise HTTPException(status_code=400, detail="Catálogo não encontrado")

            threshold = float(catalog.default_threshold_percent)
            duration = int(catalog.default_duration_minutes)
            min_interval = int(catalog.default_min_interval_minutes)
            rule_source = "CATALOG_DEFAULT"
            note = "Fallback: default do catálogo (não há template para esta fase)."

    moisture = float(payload.current_moisture_percent)
    should_irrigate = moisture < threshold
    duration_to_apply = duration if should_irrigate else 0

    # (por enquanto só registramos o evento; lógica de min_interval você pode colocar no C)
    event = IrrigationEvent(
        user_id=user_id,
        user_plant_id=user_plant_id,
        stage=stage,
        moisture_percent=moisture,
        threshold_percent=threshold,
        should_irrigate=should_irrigate,
        duration_minutes=duration_to_apply,
        rule_source=rule_source,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(event)
    db.commit()

    return SensorReadingResponse(
        user_id=user_id,
        user_plant_id=user_plant_id,
        stage=stage,
        moisture_percent=moisture,
        threshold_percent=threshold,
        should_irrigate=should_irrigate,
        duration_minutes=duration_to_apply,
        rule_source=rule_source,
        note=note,
    )
