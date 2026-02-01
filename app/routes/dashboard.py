from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.irrigation_event import IrrigationEvent
from app.schemas.dashboard import DashboardOut

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/user/{user_id}", response_model=DashboardOut)
def dashboard_user(user_id: int, db: Session = Depends(get_db)):
    total_plants = db.query(func.count(UserPlant.id)).filter(UserPlant.user_id == user_id).scalar() or 0
    total_events = db.query(func.count(IrrigationEvent.id)).filter(IrrigationEvent.user_id == user_id).scalar() or 0
    last = (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_id == user_id)
        .order_by(IrrigationEvent.id.desc())
        .first()
    )
    return {
        "user_id": user_id,
        "total_plants": int(total_plants),
        "total_events": int(total_events),
        "last_event_at": last.created_at.isoformat() if last else None,
    }
