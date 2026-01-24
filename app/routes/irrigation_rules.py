from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.irrigation_rule import IrrigationRule

router = APIRouter(prefix="/irrigation-rules", tags=["Irrigation Rules"])


@router.get("/")
def list_rules(db: Session = Depends(get_db)):
    return db.query(IrrigationRule).all()
