from sqlalchemy import Column, Integer, String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.base import Base


class PlantStageTemplate(Base):
    __tablename__ = "plant_stage_templates"
    __table_args__ = (
        UniqueConstraint("plant_catalog_id", "stage", name="uq_template_catalog_stage"),
    )

    id = Column(Integer, primary_key=True, index=True)
    plant_catalog_id = Column(Integer, ForeignKey("plant_catalog.id"), nullable=False)

    # GERMINATION, DEVELOPMENT, FLOWERING, FRUITING, HARVEST
    stage = Column(String, nullable=False)

    threshold_percent = Column(Float, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    min_interval_minutes = Column(Integer, nullable=False)

    plant_catalog = relationship("PlantCatalog", back_populates="stage_templates")
