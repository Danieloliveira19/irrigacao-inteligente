from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant_catalog import PlantCatalog
from app.models.plant_stage_template import PlantStageTemplate
from app.schemas.plant_catalog import PlantCatalogItem, SeedResponse

router = APIRouter(prefix="/plants/catalog", tags=["Plants Catalog"])


@router.get("/", response_model=list[PlantCatalogItem])
def list_catalog(db: Session = Depends(get_db)):
    return db.query(PlantCatalog).order_by(PlantCatalog.name.asc()).all()


@router.post("/seed", response_model=SeedResponse)
def seed_catalog(db: Session = Depends(get_db)):
    # se já tem dados, não duplica
    if db.query(PlantCatalog).count() > 0:
        return SeedResponse(message="catalog já possui dados", created_plants=0, created_templates=0)

    # Plantas exemplo (você pode expandir depois)
    morango = PlantCatalog(
        name="Morango",
        category="FRUTO",
        default_threshold_percent=30,
        default_duration_minutes=20,
        default_min_interval_minutes=60,
    )
    alface = PlantCatalog(
        name="Alface",
        category="VERDURA",
        default_threshold_percent=35,
        default_duration_minutes=15,
        default_min_interval_minutes=60,
    )

    db.add_all([morango, alface])
    db.commit()
    db.refresh(morango)
    db.refresh(alface)

    templates = []

    # Templates por fase (exemplo simples)
    for plant in [morango, alface]:
        templates.extend([
            PlantStageTemplate(plant_catalog_id=plant.id, stage="GERMINATION", threshold_percent=40, duration_minutes=10, min_interval_minutes=120),
            PlantStageTemplate(plant_catalog_id=plant.id, stage="DEVELOPMENT", threshold_percent=35 if plant.name == "Alface" else 30, duration_minutes=15 if plant.name == "Alface" else 20, min_interval_minutes=60),
            PlantStageTemplate(plant_catalog_id=plant.id, stage="FLOWERING", threshold_percent=28, duration_minutes=20, min_interval_minutes=90),
            PlantStageTemplate(plant_catalog_id=plant.id, stage="FRUITING", threshold_percent=26, duration_minutes=25, min_interval_minutes=90),
            PlantStageTemplate(plant_catalog_id=plant.id, stage="HARVEST", threshold_percent=30, duration_minutes=10, min_interval_minutes=120),
        ])

    db.add_all(templates)
    db.commit()

    return SeedResponse(message="seed ok", created_plants=2, created_templates=len(templates))
