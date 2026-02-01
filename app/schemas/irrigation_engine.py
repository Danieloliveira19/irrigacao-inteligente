from pydantic import BaseModel


class EngineDecisionOut(BaseModel):
    user_plant_id: int
    rule_id: int | None
    should_irrigate: bool
    reason: str
    humidity: float | None
    min_humidity: float | None
    max_humidity: float | None
    last_irrigation_at: str | None
