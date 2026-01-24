from sqlalchemy import Column, Integer, String, Float

from app.database.base import Base


class PlantCatalog(Base):
    __tablename__ = "plant_catalog"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    category = Column(String, nullable=False, default="VERDURA")  # VERDURA ou FRUTO
    scientific_name = Column(String, nullable=True)

    # Defaults gerais (fallback)
    default_threshold_percent = Column(Float, nullable=False, default=30.0)
    default_duration_minutes = Column(Integer, nullable=False, default=30)
    default_min_interval_minutes = Column(Integer, nullable=False, default=60)

    image_url = Column(String, nullable=True)
