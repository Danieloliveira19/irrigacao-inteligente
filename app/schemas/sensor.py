from pydantic import BaseModel, Field


class SensorReadingRequest(BaseModel):
    current_moisture_percent: float = Field(..., ge=0, le=100)


class SensorReadingResponse(BaseModel):
    user_id: int
    user_plant_id: int
    stage: str

    moisture_percent: float
    threshold_percent: float

    should_irrigate: bool
    duration_minutes: int

    rule_source: str
    note: str
