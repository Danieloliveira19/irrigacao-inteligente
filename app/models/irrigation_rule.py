from sqlalchemy import Column, Integer, Float, Boolean, ForeignKey, String
from app.database.base import Base


class IrrigationRule(Base):
    __tablename__ = "irrigation_rules"

    id = Column(Integer, primary_key=True, index=True)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False, index=True)

    # estágio em que a regra vale (opcional)
    stage = Column(String, nullable=True)

    threshold_percent = Column(Float, nullable=False, default=30.0)
    duration_minutes = Column(Integer, nullable=False, default=20)
    min_interval_minutes = Column(Integer, nullable=False, default=60)

    enabled = Column(Boolean, nullable=False, default=True)
