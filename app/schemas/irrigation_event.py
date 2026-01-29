from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class IrrigationEventResponse(BaseModel):
    id: int
    user_id: int
    user_plant_id: int
    stage: str
    moisture_percent: float
    threshold_percent: float
    should_irrigate: bool
    duration_minutes: int
    rule_source: str
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
