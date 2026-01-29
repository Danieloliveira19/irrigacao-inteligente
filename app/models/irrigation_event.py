from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database.base import Base


class IrrigationEvent(Base):
    __tablename__ = "irrigation_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False, index=True)

    stage = Column(String, nullable=False)

    moisture_percent = Column(Float, nullable=False)
    threshold_percent = Column(Float, nullable=False)

    should_irrigate = Column(Boolean, nullable=False)
    duration_minutes = Column(Integer, nullable=False)

    rule_source = Column(String, nullable=False)  # "custom" | "template" | "catalog_default"
    note = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    user_plant = relationship("UserPlant", back_populates="events")
