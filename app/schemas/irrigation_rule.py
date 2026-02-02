from pydantic import BaseModel


class IrrigationRuleOut(BaseModel):
    id: int
    user_plant_id: int

    stage: str | None = None

    threshold_percent: float
    duration_minutes: int
    min_interval_minutes: int
    enabled: bool

    # ===== NOVAS REGRAS =====
    rain_skip_mm: float
    moisture_stop_percent: float

    class Config:
        from_attributes = True


class IrrigationRulePatchIn(BaseModel):
    stage: str | None = None
    threshold_percent: float | None = None
    duration_minutes: int | None = None
    min_interval_minutes: int | None = None
    enabled: bool | None = None

    # ===== NOVAS REGRAS =====
    rain_skip_mm: float | None = None
    moisture_stop_percent: float | None = None
