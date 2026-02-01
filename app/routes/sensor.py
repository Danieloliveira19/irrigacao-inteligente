from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.sensor import SensorReading
from app.models.irrigation_rule import IrrigationRule
from app.models.irrigation_event import IrrigationEvent
from app.schemas.sensor import SensorReadingIn

router = APIRouter(prefix="/users/{user_id}/plants/{user_plant_id}", tags=["Sensor"])


@router.post("/sensor-reading")
def create_sensor_reading(user_id: int, user_plant_id: int, payload: SensorReadingIn, db: Session = Depends(get_db)):
    up = db.query(UserPlant).filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id).first()
    if not up:
        raise HTTPException(status_code=404, detail="User plant not found")

    reading = SensorReading(user_plant_id=user_plant_id, humidity=payload.current_moisture_percent)
    db.add(reading)
    db.commit()
    db.refresh(reading)

    # pega a primeira regra para retornar contexto
    rule = db.query(IrrigationRule).filter(IrrigationRule.user_plant_id == user_plant_id).order_by(IrrigationRule.id.asc()).first()
    threshold = rule.threshold_percent if rule else 30.0
    duration = rule.duration_minutes if rule else 20

    should = payload.current_moisture_percent <= threshold

    # log event (não quebra se algum campo for None)
    ev = IrrigationEvent(
        user_id=user_id,
        user_plant_id=user_plant_id,
        stage=up.stage,
        moisture_percent=payload.current_moisture_percent,
        threshold_percent=threshold,
        should_irrigate=1 if should else 0,
        duration_minutes=duration if should else None,
        rule_source="template",
        note="Umidade informada manualmente.",
    )
    db.add(ev)
    db.commit()

    return {
        "user_id": user_id,
        "user_plant_id": user_plant_id,
        "stage": up.stage,
        "moisture_percent": payload.current_moisture_percent,
        "threshold_percent": threshold,
        "should_irrigate": should,
        "duration_minutes": duration if should else 0,
        "rule_source": "template",
        "note": "Umidade informada manualmente.",
    }
