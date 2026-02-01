from __future__ import annotations

from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user_plant import UserPlant
from app.models.irrigation_rule import IrrigationRule
from app.models.sensor import SensorReading
from app.models.irrigation_event import IrrigationEvent


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _last_event(db: Session, user_plant_id: int) -> IrrigationEvent | None:
    return (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_plant_id == user_plant_id)
        .order_by(desc(IrrigationEvent.id))
        .first()
    )


def _last_sensor(db: Session, user_plant_id: int) -> SensorReading | None:
    return (
        db.query(SensorReading)
        .filter(SensorReading.user_plant_id == user_plant_id)
        .order_by(desc(SensorReading.id))
        .first()
    )


def decide_for_rule(
    now: datetime,
    rule: IrrigationRule,
    humidity: float | None,
    last_irrigation_at: datetime | None,
) -> tuple[bool, str]:
    if not rule.enabled:
        return False, "Regra desabilitada"

    if humidity is None:
        return False, "Sem leitura de sensor"

    if last_irrigation_at is not None:
        # ✅ garante timezone-aware
        if last_irrigation_at.tzinfo is None:
            last_irrigation_at = last_irrigation_at.replace(tzinfo=timezone.utc)

        next_allowed = last_irrigation_at + timedelta(minutes=rule.min_interval_minutes)
        if now < next_allowed:
            mins = int((next_allowed - now).total_seconds() // 60)
            return False, f"Intervalo mínimo ainda não atingido ({mins} min)"

    if humidity <= rule.threshold_percent:
        return True, "Umidade abaixo do limiar"
    return False, "Umidade acima do limiar"


def log_event(
    db: Session,
    user_id: int,
    user_plant_id: int,
    stage: str | None,
    moisture_percent: float | None,
    threshold_percent: float | None,
    should_irrigate: bool,
    duration_minutes: int | None,
    rule_source: str,
    note: str | None,
) -> IrrigationEvent:
    ev = IrrigationEvent(
        user_id=user_id,
        user_plant_id=user_plant_id,
        stage=stage,
        moisture_percent=moisture_percent,
        threshold_percent=threshold_percent,
        should_irrigate=1 if should_irrigate else 0,
        duration_minutes=duration_minutes,
        rule_source=rule_source,
        note=note,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


def run_engine_once(db: Session) -> list[dict]:
    now = utcnow()
    decisions: list[dict] = []

    user_plants = db.query(UserPlant).all()

    for up in user_plants:
        # pega regra (primeira) da planta
        rule = (
            db.query(IrrigationRule)
            .filter(IrrigationRule.user_plant_id == up.id)
            .order_by(IrrigationRule.id.asc())
            .first()
        )

        last_sensor = _last_sensor(db, up.id)
        humidity = last_sensor.humidity if last_sensor else None

        last_ev = _last_event(db, up.id)
        last_irrigation_at = None
        if last_ev and last_ev.should_irrigate == 1:
            last_irrigation_at = last_ev.created_at

        if rule is None:
            # sem regra, só loga evento informativo
            log_event(
                db=db,
                user_id=up.user_id,
                user_plant_id=up.id,
                stage=up.stage,
                moisture_percent=humidity,
                threshold_percent=None,
                should_irrigate=False,
                duration_minutes=None,
                rule_source="rule",
                note="Sem regra cadastrada para esta planta.",
            )
            decisions.append(
                {
                    "user_plant_id": up.id,
                    "rule_id": None,
                    "should_irrigate": False,
                    "reason": "Sem regra cadastrada",
                    "humidity": humidity,
                    "min_humidity": None,
                    "max_humidity": None,
                    "last_irrigation_at": last_irrigation_at.isoformat() if last_irrigation_at else None,
                }
            )
            continue

        should, reason = decide_for_rule(
            now=now,
            rule=rule,
            humidity=humidity,
            last_irrigation_at=last_irrigation_at,
        )

        log_event(
            db=db,
            user_id=up.user_id,
            user_plant_id=up.id,
            stage=up.stage,
            moisture_percent=humidity,
            threshold_percent=rule.threshold_percent,
            should_irrigate=should,
            duration_minutes=rule.duration_minutes if should else None,
            rule_source="rule",
            note=reason,
        )

        decisions.append(
            {
                "user_plant_id": up.id,
                "rule_id": rule.id,
                "should_irrigate": should,
                "reason": reason,
                "humidity": humidity,
                "min_humidity": rule.threshold_percent,
                "max_humidity": None,
                "last_irrigation_at": last_irrigation_at.isoformat() if last_irrigation_at else None,
            }
        )

    return decisions
