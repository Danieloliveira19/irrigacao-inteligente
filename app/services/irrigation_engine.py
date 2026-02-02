from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user_plant import UserPlant
from app.models.irrigation_rule import IrrigationRule
from app.models.sensor import SensorReading
from app.models.irrigation_event import IrrigationEvent


# Status / Reasons (para o front)
STATUS_IRRIGATED = "IRRIGATED"
STATUS_SKIPPED = "SKIPPED"

REASON_RULE_DISABLED = "RULE_DISABLED"
REASON_NO_SENSOR = "NO_SENSOR"
REASON_NO_RULE = "NO_RULE"
REASON_COOLDOWN = "COOLDOWN"
REASON_RAIN = "RAIN"
REASON_MOISTURE_HIGH = "MOISTURE_HIGH"
REASON_MOISTURE_OK = "MOISTURE_OK"          # umidade acima do limiar (não precisa irrigar)
REASON_MOISTURE_LOW = "MOISTURE_LOW"        # umidade abaixo do limiar (irrigar)


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


def _ensure_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def _get_moisture_percent(sensor: SensorReading | None) -> float | None:
    """
    Compatível com seu projeto:
    - se existir current_moisture_percent, usa ele
    - senão usa humidity (que no seu engine atual é o valor usado como "umidade do solo")
    """
    if not sensor:
        return None

    val = getattr(sensor, "current_moisture_percent", None)
    if val is None:
        val = getattr(sensor, "humidity", None)

    return float(val) if val is not None else None


def _get_rain_mm(sensor: SensorReading | None) -> float:
    if not sensor:
        return 0.0
    val = getattr(sensor, "rain_mm", None)
    if val is None:
        return 0.0
    return float(val or 0.0)


def decide_for_rule(
    now: datetime,
    rule: IrrigationRule,
    moisture_percent: float | None,
    rain_mm: float,
    last_irrigation_at: datetime | None,
) -> tuple[bool, str, str]:
    """
    Retorna:
      (should_irrigate, reason_code, note_humana)
    """
    # Regra desabilitada
    if not rule.enabled:
        return False, REASON_RULE_DISABLED, "Regra desabilitada"

    # Sem sensor
    if moisture_percent is None:
        return False, REASON_NO_SENSOR, "Sem leitura de sensor"

    # 1) Cooldown (min_interval_minutes)
    if last_irrigation_at is not None:
        last_irrigation_at = _ensure_aware(last_irrigation_at)
        next_allowed = last_irrigation_at + timedelta(minutes=rule.min_interval_minutes)
        if now < next_allowed:
            mins = int((next_allowed - now).total_seconds() // 60)
            return False, REASON_COOLDOWN, f"Intervalo mínimo ainda não atingido ({mins} min)"

    # 2) Chuva: se chover >= X mm, não irrigar
    # (rain_skip_mm foi adicionado no model; se não existir por algum motivo, assume 0)
    rain_skip_mm = float(getattr(rule, "rain_skip_mm", 0.0) or 0.0)
    if rain_skip_mm > 0 and rain_mm >= rain_skip_mm:
        return False, REASON_RAIN, f"Chuva detectada (rain_mm={rain_mm:.2f} >= {rain_skip_mm:.2f})"

    # 3) Umidade alta trava: se umidade >= Y%, não irrigar
    moisture_stop = float(getattr(rule, "moisture_stop_percent", 100.0) or 100.0)
    if moisture_percent >= moisture_stop:
        return False, REASON_MOISTURE_HIGH, f"Umidade alta (={moisture_percent:.1f}% >= {moisture_stop:.1f}%)"

    # 4) Regra principal (threshold_percent): irrigar se umidade <= limiar
    if moisture_percent <= rule.threshold_percent:
        return True, REASON_MOISTURE_LOW, "Umidade abaixo do limiar"
    return False, REASON_MOISTURE_OK, "Umidade acima do limiar"


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
    status: str,
    reason: str | None,
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
        status=status,
        reason=reason,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


def run_engine_once(db: Session) -> dict:
    """
    Agora retorna um resumo previsível pro front:
    - plants_evaluated
    - plants_irrigated
    - plants_blocked
    - blocked_breakdown (por reason)
    - details (por planta)
    """
    now = utcnow()

    plants_evaluated = 0
    plants_irrigated = 0
    plants_blocked = 0
    blocked_breakdown = defaultdict(int)
    details: list[dict] = []

    user_plants = db.query(UserPlant).all()

    for up in user_plants:
        plants_evaluated += 1

        # pega regra (primeira) da planta
        rule = (
            db.query(IrrigationRule)
            .filter(IrrigationRule.user_plant_id == up.id)
            .order_by(IrrigationRule.id.asc())
            .first()
        )

        last_sensor = _last_sensor(db, up.id)
        moisture = _get_moisture_percent(last_sensor)
        rain_mm = _get_rain_mm(last_sensor)

        last_ev = _last_event(db, up.id)
        last_irrigation_at = None
        if last_ev and last_ev.should_irrigate == 1:
            last_irrigation_at = last_ev.created_at

        # Sem regra -> loga SKIPPED/NO_RULE e segue
        if rule is None:
            reason_code = REASON_NO_RULE
            note = "Sem regra cadastrada para esta planta."

            log_event(
                db=db,
                user_id=up.user_id,
                user_plant_id=up.id,
                stage=up.stage,
                moisture_percent=moisture,
                threshold_percent=None,
                should_irrigate=False,
                duration_minutes=None,
                rule_source="rule",
                note=note,
                status=STATUS_SKIPPED,
                reason=reason_code,
            )

            plants_blocked += 1
            blocked_breakdown[reason_code] += 1

            details.append(
                {
                    "user_plant_id": up.id,
                    "rule_id": None,
                    "status": STATUS_SKIPPED,
                    "reason": reason_code,
                    "note": note,
                    "moisture_percent": moisture,
                    "rain_mm": rain_mm,
                    "threshold_percent": None,
                    "last_irrigation_at": last_irrigation_at.isoformat() if last_irrigation_at else None,
                }
            )
            continue

        should, reason_code, note = decide_for_rule(
            now=now,
            rule=rule,
            moisture_percent=moisture,
            rain_mm=rain_mm,
            last_irrigation_at=last_irrigation_at,
        )

        status = STATUS_IRRIGATED if should else STATUS_SKIPPED
        # Se irrigou, reason pode ficar None (ou guardar "MOISTURE_LOW")
        reason_to_save = None if should else reason_code

        log_event(
            db=db,
            user_id=up.user_id,
            user_plant_id=up.id,
            stage=up.stage,
            moisture_percent=moisture,
            threshold_percent=rule.threshold_percent,
            should_irrigate=should,
            duration_minutes=rule.duration_minutes if should else None,
            rule_source="rule",
            note=note,
            status=status,
            reason=reason_to_save,
        )

        if should:
            plants_irrigated += 1
        else:
            plants_blocked += 1
            blocked_breakdown[reason_code] += 1

        details.append(
            {
                "user_plant_id": up.id,
                "rule_id": rule.id,
                "status": status,
                "reason": reason_to_save,
                "note": note,
                "moisture_percent": moisture,
                "rain_mm": rain_mm,
                "threshold_percent": rule.threshold_percent,
                "last_irrigation_at": last_irrigation_at.isoformat() if last_irrigation_at else None,
            }
        )

    return {
        "plants_evaluated": plants_evaluated,
        "plants_irrigated": plants_irrigated,
        "plants_blocked": plants_blocked,
        "blocked_breakdown": dict(blocked_breakdown),
        "details": details,
        "ran_at": now.isoformat(),
    }
