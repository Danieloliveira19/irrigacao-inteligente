from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class PlantCatalog(Base):
    __tablename__ = "plant_catalog"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    # umidade mínima padrão para irrigar (0-100)
    default_threshold_percent = Column(Float, nullable=False, default=30.0)
    # duração padrão (min)
    default_duration_minutes = Column(Integer, nullable=False, default=20)
