from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.irrigation_event import IrrigationEvent
from app.schemas.irrigation_event import IrrigationEventResponse

router = APIRouter(prefix="/events", tags=["Irrigation Events"])


@router.get("/user/{user_id}", response_model=list[IrrigationEventResponse])
def list_user_events(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_id == user_id)
        .order_by(IrrigationEvent.created_at.desc())
        .all()
    )


@router.get("/plant/{user_plant_id}", response_model=list[IrrigationEventResponse])
def list_plant_events(user_plant_id: int, db: Session = Depends(get_db)):
    return (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_plant_id == user_plant_id)
        .order_by(IrrigationEvent.created_at.desc())
        .all()
    )
