from pydantic import BaseModel
from typing import Optional


class AddPlantFromCatalog(BaseModel):
    plant_catalog_id: int


class AddCustomPlant(BaseModel):
    custom_name: str
    threshold_percent: float
    duration_minutes: int
    min_interval_minutes: int = 60


class UpdatePlantStage(BaseModel):
    stage: str  # INITIAL | DEVELOPMENT | MID | LATE


class UserPlantResponse(BaseModel):
    id: int
    user_id: int
    plant_catalog_id: Optional[int] = None
    custom_name: Optional[str] = None
    stage: str

    class Config:
        from_attributes = True
