from pydantic import BaseModel


class DashboardOut(BaseModel):
    user_id: int
    total_plants: int
    total_events: int
    last_event_at: str | None
