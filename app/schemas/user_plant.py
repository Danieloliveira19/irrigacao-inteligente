from pydantic import BaseModel
from typing import Optional


class AddFromCatalogRequest(BaseModel):
    plant_catalog_id: int


class AddCustomPlantRequest(BaseModel):
    custom_name: str
    stage: str = "DEVELOPMENT"


class UpdateStageRequest(BaseModel):
    stage: str


class UserPlantResponse(BaseModel):
    id: int
    user_id: int
    plant_catalog_id: Optional[int] = None
    custom_name: Optional[str] = None
    stage: str

    class Config:
        from_attributes = True
