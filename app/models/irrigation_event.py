from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from app.database.base import Base


class IrrigationEvent(Base):
    __tablename__ = "irrigation_events"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False)

    stage = Column(String, nullable=False)

    moisture_percent = Column(Float, nullable=False)
    threshold_percent = Column(Float, nullable=False)

    should_irrigate = Column(Boolean, nullable=False)
    duration_minutes = Column(Integer, nullable=False)

    # CUSTOM_RULE | STAGE_TEMPLATE | CATALOG_DEFAULT
    rule_source = Column(String, nullable=False)

    # ISO string (vamos manter simples se você já estava usando created_at em outro lugar,
    # você pode trocar por DateTime depois)
    created_at = Column(String, nullable=False)
