from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant import Plant
from app.schemas.plant import PlantCreate, PlantResponse

router = APIRouter(prefix="/plants", tags=["Plantas"])


@router.post("/", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(payload: PlantCreate, db: Session = Depends(get_db)):
    # Verifica se já existe uma planta com esse nome
    existing = db.query(Plant).filter(Plant.name == payload.name).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Já existe uma planta cadastrada com esse nome."
        )

    plant = Plant(name=payload.name, category=payload.category)
    db.add(plant)
    db.commit()
    db.refresh(plant)
    return plant


@router.get("/", response_model=list[PlantResponse])
def list_plants(db: Session = Depends(get_db)):
    plants = db.query(Plant).order_by(Plant.id.asc()).all()
    return plants
