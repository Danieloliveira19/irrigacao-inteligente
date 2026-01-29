from pydantic import BaseModel
from typing import Optional


class PlantCatalogItem(BaseModel):
    id: int
    name: str
    category: str
    scientific_name: Optional[str] = None
    image_url: Optional[str] = None

    default_threshold_percent: float
    default_duration_minutes: int
    default_min_interval_minutes: int

    class Config:
        from_attributes = True


class SeedResponse(BaseModel):
    message: str
    created_plants: int
    created_templates: int
