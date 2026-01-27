from pydantic import BaseModel
from datetime import datetime


class IrrigationEventResponse(BaseModel):
    id: int
    user_id: int
    user_plant_id: int
    stage: str
    moisture_percent: float
    threshold_percent: float
    should_irrigate: bool
    duration_minutes: int
    created_at: datetime

    class Config:
        from_attributes = True
