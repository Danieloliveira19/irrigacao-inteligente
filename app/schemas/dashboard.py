from pydantic import BaseModel
from typing import List
from app.schemas.irrigation_event import IrrigationEventResponse


class DashboardResponse(BaseModel):
    user_id: int
    total_plants: int
    total_events: int
    last_events: List[IrrigationEventResponse]
