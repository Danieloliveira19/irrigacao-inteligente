from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant_catalog import PlantCatalog
from app.models.plant_stage_template import PlantStageTemplate

router = APIRouter(prefix="/plants/catalog", tags=["Plants Catalog"])


@router.get("")
def list_catalog(db: Session = Depends(get_db)):
    items = db.query(PlantCatalog).order_by(PlantCatalog.name.asc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "scientific_name": p.scientific_name,
            "default_threshold_percent": p.default_threshold_percent,
            "default_duration_minutes": p.default_duration_minutes,
            "default_min_interval_minutes": p.default_min_interval_minutes,
            "image_url": p.image_url,
        }
        for p in items
    ]


@router.post("/seed")
def seed_catalog(db: Session = Depends(get_db)):
    try:
        if db.query(PlantCatalog).count() > 0:
            return {"message": "catalog já possui dados", "created_plants": 0, "created_templates": 0}

        # plantas exemplo
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

        stages = ["GERMINATION", "DEVELOPMENT", "FLOWERING", "FRUITING", "HARVEST"]

        def make_templates(plant_id: int, base_threshold: float, base_duration: int):
            # valores simples (você ajusta depois)
            return [
                PlantStageTemplate(
                    plant_catalog_id=plant_id,
                    stage=st,
                    threshold_percent=base_threshold,
                    duration_minutes=base_duration,
                    min_interval_minutes=60,
                )
                for st in stages
            ]

        templates = []
        templates += make_templates(morango.id, 30, 20)
        templates += make_templates(alface.id, 35, 15)

        db.add_all(templates)
        db.commit()

        return {"message": "seed ok", "created_plants": 2, "created_templates": len(templates)}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"seed failed: {e}")
