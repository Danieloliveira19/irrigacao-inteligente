from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant import Plant

router = APIRouter(prefix="/plants", tags=["Plants"])


@router.get("/")
def list_plants(db: Session = Depends(get_db)):
    return db.query(Plant).all()

