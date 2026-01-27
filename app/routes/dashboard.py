from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.deps import get_db
from app.models.user import User
from app.models.user_plant import UserPlant
from app.models.plant_catalog import PlantCatalog
from app.models.irrigation_event import IrrigationEvent
from app.schemas.dashboard import DashboardResponse, DashboardPlantSummary, DashboardCardResponse

router = APIRouter(prefix="/users", tags=["Dashboard"])


def _today_local_str(tz_name: str) -> str:
    tz = ZoneInfo(tz_name)
    today_local = datetime.now(tz).date()
    return str(today_local)


def _status_from_moisture(moisture: float, threshold: float) -> tuple[str, float]:
    """
    Status baseado na distância até o threshold.
    delta = moisture - threshold

    Regras:
    - OK: delta >= 5
    - ATENCAO: -5 < delta < 5
    - CRITICO: delta <= -5
    """
    delta = moisture - threshold

    if delta >= 5:
        return "OK", delta
    if delta <= -5:
        return "CRITICO", delta
    return "ATENCAO", delta


@router.get("/{user_id}/dashboard", response_model=DashboardResponse)
def user_dashboard(user_id: int, db: Session = Depends(get_db)):
    tz_name = "America/Sao_Paulo"
    today_local = _today_local_str(tz_name)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    total_events_today = (
        db.query(func.count(IrrigationEvent.id))
        .filter(
            IrrigationEvent.user_id == user_id,
            func.date(IrrigationEvent.created_at) == today_local,
        )
        .scalar()
        or 0
    )

    total_irrigations_today = (
        db.query(func.count(IrrigationEvent.id))
        .filter(
            IrrigationEvent.user_id == user_id,
            func.date(IrrigationEvent.created_at) == today_local,
            IrrigationEvent.should_irrigate == True,  # noqa: E712
        )
        .scalar()
        or 0
    )

    last_event = (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_id == user_id)
        .order_by(IrrigationEvent.created_at.desc())
        .first()
    )

    plants = db.query(UserPlant).filter(UserPlant.user_id == user_id).all()
    plant_cards: list[DashboardPlantSummary] = []

    for p in plants:
        plant_name = p.custom_name if p.custom_name else None
        category = None

        if p.plant_catalog_id:
            catalog = db.query(PlantCatalog).filter(PlantCatalog.id == p.plant_catalog_id).first()
            if catalog:
                plant_name = catalog.name
                category = catalog.category

        if not plant_name:
            plant_name = "Planta"

        # último evento da planta
        pe = (
            db.query(IrrigationEvent)
            .filter(
                IrrigationEvent.user_id == user_id,
                IrrigationEvent.user_plant_id == p.id,
            )
            .order_by(IrrigationEvent.created_at.desc())
            .first()
        )

        irrigations_today = (
            db.query(func.count(IrrigationEvent.id))
            .filter(
                IrrigationEvent.user_id == user_id,
                IrrigationEvent.user_plant_id == p.id,
                func.date(IrrigationEvent.created_at) == today_local,
                IrrigationEvent.should_irrigate == True,  # noqa: E712
            )
            .scalar()
            or 0
        )

        events_today = (
            db.query(func.count(IrrigationEvent.id))
            .filter(
                IrrigationEvent.user_id == user_id,
                IrrigationEvent.user_plant_id == p.id,
                func.date(IrrigationEvent.created_at) == today_local,
            )
            .scalar()
            or 0
        )

        # Inteligência do status
        if pe is None:
            status = "SEM_DADOS"
            delta = None
        else:
            status, delta = _status_from_moisture(pe.moisture_percent, pe.threshold_percent)

        plant_cards.append(
            DashboardPlantSummary(
                user_plant_id=p.id,
                plant_name=plant_name,
                category=category,
                stage=p.stage,
                last_moisture_percent=getattr(pe, "moisture_percent", None),
                last_threshold_percent=getattr(pe, "threshold_percent", None),
                last_should_irrigate=getattr(pe, "should_irrigate", None),
                last_duration_minutes=getattr(pe, "duration_minutes", None),
                last_event_at=getattr(pe, "created_at", None),
                irrigations_today=irrigations_today,
                events_today=events_today,
                status=status,
                delta_to_threshold=delta,
            )
        )

    return DashboardResponse(
        user_id=user_id,
        timezone=tz_name,
        total_events_today=total_events_today,
        total_irrigations_today=total_irrigations_today,
        last_event_at=getattr(last_event, "created_at", None),
        last_event_should_irrigate=getattr(last_event, "should_irrigate", None),
        plants=plant_cards,
    )


@router.get("/{user_id}/dashboard/card", response_model=DashboardCardResponse)
def dashboard_card(user_id: int, db: Session = Depends(get_db)):
    tz_name = "America/Sao_Paulo"
    today_local = _today_local_str(tz_name)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    total_events_today = (
        db.query(func.count(IrrigationEvent.id))
        .filter(
            IrrigationEvent.user_id == user_id,
            func.date(IrrigationEvent.created_at) == today_local,
        )
        .scalar()
        or 0
    )

    total_irrigations_today = (
        db.query(func.count(IrrigationEvent.id))
        .filter(
            IrrigationEvent.user_id == user_id,
            func.date(IrrigationEvent.created_at) == today_local,
            IrrigationEvent.should_irrigate == True,  # noqa: E712
        )
        .scalar()
        or 0
    )

    last_event = (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_id == user_id)
        .order_by(IrrigationEvent.created_at.desc())
        .first()
    )

    plants = db.query(UserPlant).filter(UserPlant.user_id == user_id).all()

    ok_count = 0
    att_count = 0
    crit_count = 0
    nodata_count = 0

    for p in plants:
        pe = (
            db.query(IrrigationEvent)
            .filter(
                IrrigationEvent.user_id == user_id,
                IrrigationEvent.user_plant_id == p.id,
            )
            .order_by(IrrigationEvent.created_at.desc())
            .first()
        )

        if pe is None:
            nodata_count += 1
            continue

        status, _ = _status_from_moisture(pe.moisture_percent, pe.threshold_percent)
        if status == "OK":
            ok_count += 1
        elif status == "ATENCAO":
            att_count += 1
        else:
            crit_count += 1

    return DashboardCardResponse(
        user_id=user_id,
        total_events_today=total_events_today,
        total_irrigations_today=total_irrigations_today,
        last_event_at=getattr(last_event, "created_at", None),
        plants_total=len(plants),
        plants_ok=ok_count,
        plants_attention=att_count,
        plants_critical=crit_count,
        plants_no_data=nodata_count,
    )
