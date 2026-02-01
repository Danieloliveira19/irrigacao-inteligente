from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from app.database.base import Base


class IrrigationEvent(Base):
    __tablename__ = "irrigation_events"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False, index=True)

    stage = Column(String, nullable=True)

    # ✅ IMPORTANTE: deixar NULL permitido evita seu erro NOT NULL
    moisture_percent = Column(Float, nullable=True)
    threshold_percent = Column(Float, nullable=True)

    should_irrigate = Column(Integer, nullable=False, default=0)  # 0/1 (sqlite)
    duration_minutes = Column(Integer, nullable=True)

    rule_source = Column(String, nullable=True)  # "rule" | "template" | "sensor" etc.
    note = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
