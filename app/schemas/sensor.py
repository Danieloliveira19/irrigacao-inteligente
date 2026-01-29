from pydantic import BaseModel
from typing import Optional


class SensorReadingRequest(BaseModel):
    current_moisture_percent: float


class SensorReadingResponse(BaseModel):
    user_id: int
    user_plant_id: int
    stage: str

    moisture_percent: float
    threshold_percent: float

    should_irrigate: bool
    duration_minutes: int

    rule_source: str
    note: Optional[str] = None
