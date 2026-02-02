from datetime import datetime
from pydantic import BaseModel


class IrrigationEventOut(BaseModel):
    id: int
    user_id: int
    user_plant_id: int

    stage: str | None = None
    moisture_percent: float | None = None
    threshold_percent: float | None = None

    should_irrigate: int
    duration_minutes: int | None = None

    rule_source: str | None = None
    note: str | None = None

    # ===== NOVOS CAMPOS =====
    # IRRIGATED | SKIPPED
    status: str

    # RAIN | MOISTURE_HIGH | COOLDOWN | NO_SENSOR | ...
    reason: str | None = None

    # agora é datetime (não string)
    created_at: datetime

    class Config:
        from_attributes = True
