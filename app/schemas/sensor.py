from pydantic import BaseModel


class SensorReadingIn(BaseModel):
    current_moisture_percent: float  # 0-100
