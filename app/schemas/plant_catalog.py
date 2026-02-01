from pydantic import BaseModel


class CatalogSeedIn(BaseModel):
    plants: list[dict]  # simplificado


class CatalogPlantOut(BaseModel):
    id: int
    name: str
    default_threshold_percent: float
    default_duration_minutes: int

    class Config:
        from_attributes = True
