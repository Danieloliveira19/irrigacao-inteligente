from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.irrigation_event import IrrigationEvent
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/user/{user_id}", response_model=DashboardResponse)
def user_dashboard(user_id: int, db: Session = Depends(get_db)):
    total_plants = db.query(UserPlant).filter(UserPlant.user_id == user_id).count()
    total_events = db.query(IrrigationEvent).filter(IrrigationEvent.user_id == user_id).count()

    last_events = (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_id == user_id)
        .order_by(IrrigationEvent.created_at.desc())
        .limit(10)
        .all()
    )

    return DashboardResponse(
        user_id=user_id,
        total_plants=total_plants,
        total_events=total_events,
        last_events=last_events,
    )
