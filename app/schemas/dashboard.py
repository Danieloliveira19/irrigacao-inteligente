from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DashboardPlantSummary(BaseModel):
    user_plant_id: int
    plant_name: str
    category: Optional[str] = None
    stage: str

    last_moisture_percent: Optional[float] = None
    last_threshold_percent: Optional[float] = None
    last_should_irrigate: Optional[bool] = None
    last_duration_minutes: Optional[int] = None
    last_event_at: Optional[datetime] = None

    irrigations_today: int
    events_today: int

    # Inteligência
    status: str  # OK | ATENCAO | CRITICO | SEM_DADOS
    delta_to_threshold: Optional[float] = None  # (moisture - threshold)

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    user_id: int
    timezone: str = "America/Sao_Paulo"

    total_events_today: int
    total_irrigations_today: int

    last_event_at: Optional[datetime] = None
    last_event_should_irrigate: Optional[bool] = None

    plants: list[DashboardPlantSummary]

    class Config:
        from_attributes = True


class DashboardCardResponse(BaseModel):
    user_id: int
    total_events_today: int
    total_irrigations_today: int
    last_event_at: Optional[datetime] = None

    # Resumo de status
    plants_total: int
    plants_ok: int
    plants_attention: int
    plants_critical: int
    plants_no_data: int
