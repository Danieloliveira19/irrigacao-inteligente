from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.irrigation_rule import IrrigationRule
from app.schemas.irrigation_rule import IrrigationRuleOut, IrrigationRulePatchIn

router = APIRouter(prefix="/rules", tags=["Irrigation Rules"])


@router.get("/user-plant/{user_plant_id}", response_model=list[IrrigationRuleOut])
def list_rules(user_plant_id: int, db: Session = Depends(get_db)):
    return db.query(IrrigationRule).filter(IrrigationRule.user_plant_id == user_plant_id).all()


@router.patch("/{rule_id}", response_model=IrrigationRuleOut)
def patch_rule(rule_id: int, payload: IrrigationRulePatchIn, db: Session = Depends(get_db)):
    rule = db.query(IrrigationRule).filter(IrrigationRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(rule, k, v)

    db.commit()
    db.refresh(rule)
    return rule
