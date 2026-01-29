from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.user import User
from app.models.user_plant import UserPlant
from app.models.plant_catalog import PlantCatalog
from app.schemas.user_plant import (
    AddFromCatalogRequest,
    AddCustomPlantRequest,
    UpdateStageRequest,
    UserPlantResponse,
)

router = APIRouter(prefix="/users/{user_id}/plants", tags=["User Plants"])


def _get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.get("/", response_model=list[UserPlantResponse])
def list_user_plants(user_id: int, db: Session = Depends(get_db)):
    _get_user(db, user_id)
    return db.query(UserPlant).filter(UserPlant.user_id == user_id).order_by(UserPlant.id.asc()).all()


@router.post("/from-catalog", response_model=UserPlantResponse)
def add_from_catalog(user_id: int, payload: AddFromCatalogRequest, db: Session = Depends(get_db)):
    _get_user(db, user_id)

    catalog = db.query(PlantCatalog).filter(PlantCatalog.id == payload.plant_catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="PlantCatalog não encontrado")

    plant = UserPlant(
        user_id=user_id,
        plant_catalog_id=catalog.id,
        custom_name=None,
        stage="DEVELOPMENT",
    )
    db.add(plant)
    db.commit()
    db.refresh(plant)
    return plant


@router.post("/custom", response_model=UserPlantResponse)
def add_custom(user_id: int, payload: AddCustomPlantRequest, db: Session = Depends(get_db)):
    _get_user(db, user_id)

    plant = UserPlant(
        user_id=user_id,
        plant_catalog_id=None,
        custom_name=payload.custom_name,
        stage=payload.stage,
    )
    db.add(plant)
    db.commit()
    db.refresh(plant)
    return plant


@router.put("/{user_plant_id}/stage", response_model=UserPlantResponse)
def update_stage(user_id: int, user_plant_id: int, payload: UpdateStageRequest, db: Session = Depends(get_db)):
    _get_user(db, user_id)

    plant = db.query(UserPlant).filter(UserPlant.id == user_plant_id, UserPlant.user_id == user_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Planta do usuário não encontrada")

    plant.stage = payload.stage
    db.commit()
    db.refresh(plant)
    return plant
