from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user_plant import UserPlant
from app.models.irrigation_rule import IrrigationRule
from app.schemas.irrigation_rule import IrrigationRuleCreate, IrrigationRuleResponse

router = APIRouter(prefix="/rules", tags=["Irrigation Rules"])


@router.get("/user-plant/{user_plant_id}", response_model=list[IrrigationRuleResponse])
def list_rules(user_plant_id: int, db: Session = Depends(get_db)):
    return (
        db.query(IrrigationRule)
        .filter(IrrigationRule.user_plant_id == user_plant_id)
        .order_by(IrrigationRule.created_at.desc())
        .all()
    )


@router.post("/user-plant/{user_plant_id}", response_model=IrrigationRuleResponse)
def create_rule(user_plant_id: int, payload: IrrigationRuleCreate, db: Session = Depends(get_db)):
    plant = db.query(UserPlant).filter(UserPlant.id == user_plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="UserPlant não encontrado")

    rule = IrrigationRule(
        user_plant_id=user_plant_id,
        stage=payload.stage,
        threshold_percent=payload.threshold_percent,
        duration_minutes=payload.duration_minutes,
        min_interval_minutes=payload.min_interval_minutes,
        enabled=payload.enabled,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule
