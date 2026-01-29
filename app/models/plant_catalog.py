from sqlalchemy import Column, Integer, String, Float

from sqlalchemy.orm import relationship
from app.database.base import Base


class PlantCatalog(Base):
    __tablename__ = "plant_catalog"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    category = Column(String, nullable=False)  # VERDURA / FRUTO (por enquanto)
    scientific_name = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    # defaults (fallback final)
    default_threshold_percent = Column(Float, nullable=False, default=30.0)
    default_duration_minutes = Column(Integer, nullable=False, default=20)
    default_min_interval_minutes = Column(Integer, nullable=False, default=60)

    stage_templates = relationship(
        "PlantStageTemplate",
        back_populates="plant_catalog",
        cascade="all, delete-orphan",
    )

    user_plants = relationship("UserPlant", back_populates="plant_catalog")
