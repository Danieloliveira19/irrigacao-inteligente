from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database.base import Base


class PlantStageTemplate(Base):
    __tablename__ = "plant_stage_templates"

    id = Column(Integer, primary_key=True, index=True)
    plant_catalog_id = Column(Integer, ForeignKey("plant_catalog.id"), nullable=False)

    # INITIAL | DEVELOPMENT | MID | LATE
    stage = Column(String, nullable=False)

    threshold_percent = Column(Float, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    min_interval_minutes = Column(Integer, nullable=False)
