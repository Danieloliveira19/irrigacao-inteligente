from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.services.irrigation_engine import run_engine_once

router = APIRouter(prefix="/engine", tags=["Irrigation Engine"])


@router.post("/run")
def run_engine(db: Session = Depends(get_db)):
    return run_engine_once(db)
