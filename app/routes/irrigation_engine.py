from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.services.irrigation_engine import run_engine_once

router = APIRouter(prefix="/engine", tags=["Irrigation Engine"])


@router.post("/run")
def run_engine(db: Session = Depends(get_db)):
    """
    Executa a engine de irrigação e retorna um resumo previsível pro front:
    - plants_evaluated
    - plants_irrigated
    - plants_blocked
    - blocked_breakdown
    - details
    - ran_at
    """
    return run_engine_once(db)
