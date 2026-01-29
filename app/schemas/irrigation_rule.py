from pydantic import BaseModel


class IrrigationRuleCreate(BaseModel):
    stage: str
    threshold_percent: float
    duration_minutes: int
    min_interval_minutes: int = 60
    enabled: bool = True


class IrrigationRuleResponse(BaseModel):
    id: int
    user_plant_id: int
    stage: str
    threshold_percent: float
    duration_minutes: int
    min_interval_minutes: int
    enabled: bool

    class Config:
        from_attributes = True
