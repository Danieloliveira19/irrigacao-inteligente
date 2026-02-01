from pydantic import BaseModel


class UserPlantOut(BaseModel):
    id: int
    user_id: int
    stage: str
    plant_id: int | None = None
    catalog_id: int | None = None

    class Config:
        from_attributes = True


class AddFromCatalogIn(BaseModel):
    catalog_id: int


class AddCustomPlantIn(BaseModel):
    name: str
    default_threshold_percent: float = 30.0
    default_duration_minutes: int = 20


class UpdateStageIn(BaseModel):
    stage: str
