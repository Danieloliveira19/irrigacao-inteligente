from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user import User
from app.models.user_plant import UserPlant
from app.models.plant_catalog import PlantCatalog
from app.models.irrigation_rule import IrrigationRule

router = APIRouter(prefix="/users/{user_id}/plants", tags=["User Plants"])


def _get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.get("")
def list_user_plants(user_id: int, db: Session = Depends(get_db)):
    _get_user(db, user_id)
    plants = db.query(UserPlant).filter(UserPlant.user_id == user_id).all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "plant_catalog_id": p.plant_catalog_id,
            "custom_name": p.custom_name,
            "stage": p.stage,
        }
        for p in plants
    ]


@router.post("/from-catalog")
def add_from_catalog(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
):
    """
    Body esperado:
    {
      "plant_catalog_id": 1,
      "custom_name": "Meu morango" (opcional),
      "stage": "DEVELOPMENT" (opcional)
    }
    """
    _get_user(db, user_id)

    plant_catalog_id = payload.get("plant_catalog_id")
    if not plant_catalog_id:
        raise HTTPException(status_code=400, detail="plant_catalog_id é obrigatório")

    catalog = db.query(PlantCatalog).filter(PlantCatalog.id == plant_catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="Planta do catálogo não encontrada")

    stage = payload.get("stage") or "DEVELOPMENT"
    custom_name = payload.get("custom_name")

    # cria a planta do usuário
    user_plant = UserPlant(
        user_id=user_id,
        plant_catalog_id=plant_catalog_id,
        custom_name=custom_name,
        stage=stage,
    )
    db.add(user_plant)
    db.commit()
    db.refresh(user_plant)

    # ✅ opcional: cria uma regra custom inicial (enabled=True) usando defaults do catálogo
    # (se você preferir NÃO criar regra custom aqui, eu tiro esse bloco)
    rule = IrrigationRule(
        user_plant_id=user_plant.id,
        stage=stage,
        threshold_percent=catalog.default_threshold_percent,
        duration_minutes=catalog.default_duration_minutes,
        min_interval_minutes=catalog.default_min_interval_minutes,
        enabled=True,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)

    return {
        "message": "user plant created",
        "user_plant": {
            "id": user_plant.id,
            "user_id": user_plant.user_id,
            "plant_catalog_id": user_plant.plant_catalog_id,
            "custom_name": user_plant.custom_name,
            "stage": user_plant.stage,
        },
        "initial_custom_rule": {
            "id": rule.id,
            "stage": rule.stage,
            "threshold_percent": rule.threshold_percent,
            "duration_minutes": rule.duration_minutes,
            "min_interval_minutes": rule.min_interval_minutes,
            "enabled": rule.enabled,
        },
    }
