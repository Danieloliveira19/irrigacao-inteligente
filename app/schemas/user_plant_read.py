# app/schemas/user_plant_read.py
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserPlantRead(BaseModel):
    user_plant_id: int
    user_id: int
    plant_name: str
    stage: str
    status: str
    last_irrigation_at: Optional[datetime] = None

    class Config:
        from_attributes = True
