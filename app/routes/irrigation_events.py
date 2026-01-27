from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user import User
from app.models.user_plant import UserPlant
from app.models.irrigation_event import IrrigationEvent
from app.schemas.irrigation_event import IrrigationEventResponse

router = APIRouter(prefix="/users", tags=["Irrigation History"])


@router.get("/{user_id}/events", response_model=list[IrrigationEventResponse])
def list_user_events(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return (
        db.query(IrrigationEvent)
        .filter(IrrigationEvent.user_id == user_id)
        .order_by(IrrigationEvent.created_at.desc())
        .all()
    )


@router.get("/{user_id}/plants/{user_plant_id}/events", response_model=list[IrrigationEventResponse])
def list_events_by_plant(user_id: int, user_plant_id: int, db: Session = Depends(get_db)):
    plant = (
        db.query(UserPlant)
        .filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id)
        .first()
    )
    if not plant:
        raise HTTPException(status_code=404, detail="Planta do usuário não encontrada")

    return (
        db.query(IrrigationEvent)
        .filter(
            IrrigationEvent.user_id == user_id,
            IrrigationEvent.user_plant_id == user_plant_id,
        )
        .order_by(IrrigationEvent.created_at.desc())
        .all()
    )
