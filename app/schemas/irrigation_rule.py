from pydantic import BaseModel


class IrrigationRuleCreate(BaseModel):
    frequency_days: int
    water_ml: int
    period: str
    notes: str | None = None


class IrrigationRuleResponse(BaseModel):
    id: int
    plant_id: int
    frequency_days: int
    water_ml: int
    period: str
    notes: str | None = None

    class Config:
        from_attributes = True
