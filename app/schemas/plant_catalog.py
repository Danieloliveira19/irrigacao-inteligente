from pydantic import BaseModel
from typing import Optional


class PlantCatalogResponse(BaseModel):
    id: int
    name: str
    category: str
    scientific_name: Optional[str] = None

    default_threshold_percent: float
    default_duration_minutes: int
    default_min_interval_minutes: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
