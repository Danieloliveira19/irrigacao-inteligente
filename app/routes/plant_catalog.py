from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.plant_catalog import PlantCatalog
from app.models.plant_stage_template import PlantStageTemplate
from app.schemas.plant_catalog import PlantCatalogResponse
from app.schemas.plant_stage_template import PlantStageTemplateResponse

router = APIRouter(prefix="/plants", tags=["Plants Catalog"])


# =========================
# LISTAR CATÁLOGO
# =========================
@router.get("/catalog", response_model=list[PlantCatalogResponse])
def list_catalog(db: Session = Depends(get_db)):
    return (
        db.query(PlantCatalog)
        .order_by(PlantCatalog.category.asc(), PlantCatalog.name.asc())
        .all()
    )


# =========================
# LISTAR FASES DE UMA PLANTA
# =========================
@router.get(
    "/catalog/{plant_catalog_id}/stages",
    response_model=list[PlantStageTemplateResponse],
)
def list_stage_templates(plant_catalog_id: int, db: Session = Depends(get_db)):
    return (
        db.query(PlantStageTemplate)
        .filter(PlantStageTemplate.plant_catalog_id == plant_catalog_id)
        .order_by(PlantStageTemplate.stage.asc())
        .all()
    )


# =========================
# SEED DO CATÁLOGO (IDEMPOTENTE)
# =========================
@router.post("/catalog/seed")
def seed_catalog(db: Session = Depends(get_db)):
    """
    Cria ou atualiza:
    - Plantas do catálogo
    - Categorias (VERDURA / FRUTO)
    - Nomes científicos
    - Templates de irrigação por fase

    Pode ser rodado várias vezes sem duplicar dados.
    """

    plants_data = {
        "Morango": {
            "category": "FRUTO",
            "scientific_name": "Fragaria × ananassa",
            "stages": [
                ("INITIAL", 35.0, 15, 120),
                ("DEVELOPMENT", 30.0, 20, 90),
                ("MID", 28.0, 30, 60),
                ("LATE", 30.0, 20, 90),
            ],
        },
        "Alface": {
            "category": "VERDURA",
            "scientific_name": "Lactuca sativa",
            "stages": [
                ("INITIAL", 40.0, 10, 120),
                ("DEVELOPMENT", 35.0, 15, 90),
                ("MID", 33.0, 20, 60),
                ("LATE", 35.0, 12, 120),
            ],
        },
        "Tomate": {
            "category": "FRUTO",
            "scientific_name": "Solanum lycopersicum",
            "stages": [
                ("INITIAL", 35.0, 12, 120),
                ("DEVELOPMENT", 30.0, 18, 90),
                ("MID", 28.0, 25, 60),
                ("LATE", 30.0, 18, 90),
            ],
        },
        "Pepino": {
            "category": "FRUTO",
            "scientific_name": "Cucumis sativus",
            "stages": [
                ("INITIAL", 35.0, 12, 120),
                ("DEVELOPMENT", 30.0, 18, 90),
                ("MID", 28.0, 22, 60),
                ("LATE", 30.0, 15, 90),
            ],
        },
    }

    created_or_updated_plants = 0
    created_or_updated_templates = 0

    for name, data in plants_data.items():
        # Planta
        plant = db.query(PlantCatalog).filter(PlantCatalog.name == name).first()
        if not plant:
            plant = PlantCatalog(
                name=name,
                category=data["category"],
                scientific_name=data["scientific_name"],
                default_threshold_percent=30.0,
                default_duration_minutes=20,
                default_min_interval_minutes=60,
            )
            db.add(plant)
            db.commit()
            db.refresh(plant)
            created_or_updated_plants += 1
        else:
            plant.category = data["category"]
            plant.scientific_name = data["scientific_name"]
            db.commit()
            created_or_updated_plants += 1

        # Templates por fase
        for stage, thr, dur, interval in data["stages"]:
            template = (
                db.query(PlantStageTemplate)
                .filter(
                    PlantStageTemplate.plant_catalog_id == plant.id,
                    PlantStageTemplate.stage == stage,
                )
                .first()
            )

            if not template:
                template = PlantStageTemplate(
                    plant_catalog_id=plant.id,
                    stage=stage,
                    threshold_percent=thr,
                    duration_minutes=dur,
                    min_interval_minutes=interval,
                )
                db.add(template)
                created_or_updated_templates += 1
            else:
                template.threshold_percent = thr
                template.duration_minutes = dur
                template.min_interval_minutes = interval
                created_or_updated_templates += 1

        db.commit()

    return {
        "message": "seed completed",
        "plants_processed": created_or_updated_plants,
        "stage_templates_processed": created_or_updated_templates,
    }
