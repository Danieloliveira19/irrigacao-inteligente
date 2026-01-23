from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant import Plant
from app.models.irrigation_rule import IrrigationRule
from app.schemas.irrigation_rule import (
    IrrigationRuleCreate,
    IrrigationRuleResponse,
)

router = APIRouter(
    prefix="/plants",
    tags=["Regras de Irrigação"]
)


@router.post(
    "/{plant_id}/rules",
    response_model=IrrigationRuleResponse,
    status_code=status.HTTP_201_CREATED
)
def create_rule(
    plant_id: int,
    payload: IrrigationRuleCreate,
    db: Session = Depends(get_db),
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Planta não encontrada")

    rule = IrrigationRule(
        plant_id=plant_id,
        frequency_days=payload.frequency_days,
        water_ml=payload.water_ml,
        period=payload.period,
        notes=payload.notes,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


@router.get(
    "/{plant_id}/rules",
    response_model=list[IrrigationRuleResponse]
)
def list_rules(
    plant_id: int,
    db: Session = Depends(get_db),
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Planta não encontrada")

    return (
        db.query(IrrigationRule)
        .filter(IrrigationRule.plant_id == plant_id)
        .order_by(IrrigationRule.id.asc())
        .all()
    )
