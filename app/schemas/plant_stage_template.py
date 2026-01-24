from pydantic import BaseModel


class PlantStageTemplateResponse(BaseModel):
    id: int
    plant_catalog_id: int
    stage: str
    threshold_percent: float
    duration_minutes: int
    min_interval_minutes: int

    class Config:
        from_attributes = True
