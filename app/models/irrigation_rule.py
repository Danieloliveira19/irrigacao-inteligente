from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database.base import Base


class IrrigationRule(Base):
    __tablename__ = "irrigation_rules"

    id = Column(Integer, primary_key=True, index=True)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False, index=True)

    # regra por fase
    stage = Column(String, nullable=False)

    threshold_percent = Column(Float, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    min_interval_minutes = Column(Integer, nullable=False, default=60)

    enabled = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    user_plant = relationship("UserPlant", back_populates="irrigation_rules")
