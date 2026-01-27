from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class IrrigationRule(Base):
    __tablename__ = "irrigation_rules"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False)

    # GERMINATION | DEVELOPMENT | FLOWERING | FRUITING | HARVEST
    stage = Column(String, nullable=False)

    threshold_percent = Column(Float, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    min_interval_minutes = Column(Integer, nullable=False)

    # ✅ evita aquele erro antigo: "'enabled' is an invalid keyword argument"
    enabled = Column(Boolean, default=True, nullable=False)

    # relacionamentos
    user_plant = relationship("UserPlant", back_populates="rules")
