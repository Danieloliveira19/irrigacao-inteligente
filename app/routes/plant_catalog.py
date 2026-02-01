from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant_catalog import PlantCatalog
from app.schemas.plant_catalog import CatalogPlantOut

router = APIRouter(prefix="/plants/catalog", tags=["Plant Catalog"])


@router.get("/", response_model=list[CatalogPlantOut])
def list_catalog(db: Session = Depends(get_db)):
    return db.query(PlantCatalog).all()


@router.post("/seed", response_model=dict)
def seed_catalog(db: Session = Depends(get_db)):
    # seed simples
    if db.query(PlantCatalog).count() > 0:
        return {"ok": True, "message": "Catalog already seeded"}

    items = [
        PlantCatalog(name="Alface", default_threshold_percent=30.0, default_duration_minutes=20),
        PlantCatalog(name="Tomate", default_threshold_percent=35.0, default_duration_minutes=25),
        PlantCatalog(name="Manjericão", default_threshold_percent=28.0, default_duration_minutes=15),
    ]
    db.add_all(items)
    db.commit()
    return {"ok": True, "seeded": len(items)}
