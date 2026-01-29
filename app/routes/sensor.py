from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.irrigation_rule import IrrigationRule
from app.models.plant_stage_template import PlantStageTemplate
from app.models.plant_catalog import PlantCatalog
from app.models.irrigation_event import IrrigationEvent

from app.schemas.sensor import SensorReadingRequest, SensorReadingResponse

router = APIRouter(prefix="/users/{user_id}/plants/{user_plant_id}", tags=["Sensor"])


def _pick_rule(db: Session, plant: UserPlant):
    stage = plant.stage

    # 1) custom (IrrigationRule)
    custom = (
        db.query(IrrigationRule)
        .filter(
            IrrigationRule.user_plant_id == plant.id,
            IrrigationRule.stage == stage,
            IrrigationRule.enabled.is_(True),
        )
        .order_by(IrrigationRule.created_at.desc())
        .first()
    )
    if custom:
        return ("custom", custom.threshold_percent, custom.duration_minutes, custom.min_interval_minutes)

    # 2) template (PlantStageTemplate) - precisa ter catalog
    if plant.plant_catalog_id:
        tpl = (
            db.query(PlantStageTemplate)
            .filter(
                PlantStageTemplate.plant_catalog_id == plant.plant_catalog_id,
                PlantStageTemplate.stage == stage,
            )
            .first()
        )
        if tpl:
            return ("template", tpl.threshold_percent, tpl.duration_minutes, tpl.min_interval_minutes)

        # 3) default do catálogo
        catalog = db.query(PlantCatalog).filter(PlantCatalog.id == plant.plant_catalog_id).first()
        if catalog:
            return ("catalog_default", catalog.default_threshold_percent, catalog.default_duration_minutes, catalog.default_min_interval_minutes)

    # se for planta custom sem catálogo, fallback final fixo
    return ("catalog_default", 30.0, 20, 60)


@router.post("/sensor-reading", response_model=SensorReadingResponse)
def sensor_reading(
    user_id: int,
    user_plant_id: int,
    payload: SensorReadingRequest,
    db: Session = Depends(get_db),
):
    plant = db.query(UserPlant).filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="UserPlant não encontrado")

    rule_source, threshold, duration, min_interval = _pick_rule(db, plant)

    moisture = float(payload.current_moisture_percent)
    should_irrigate = moisture < float(threshold)
    duration_to_apply = int(duration) if should_irrigate else 0

    note = "Umidade informada manualmente."

    event = IrrigationEvent(
        user_id=user_id,
        user_plant_id=plant.id,
        stage=plant.stage,
        moisture_percent=moisture,
        threshold_percent=float(threshold),
        should_irrigate=bool(should_irrigate),
        duration_minutes=duration_to_apply,
        rule_source=rule_source,
        note=note,
    )
    db.add(event)
    db.commit()

    return SensorReadingResponse(
        user_id=user_id,
        user_plant_id=user_plant_id,
        stage=plant.stage,
        moisture_percent=moisture,
        threshold_percent=float(threshold),
        should_irrigate=bool(should_irrigate),
        duration_minutes=duration_to_apply,
        rule_source=rule_source,
        note=note,
    )
