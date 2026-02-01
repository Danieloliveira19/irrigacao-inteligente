from sqlalchemy import Column, Integer, ForeignKey, String
from app.database.base import Base


class UserPlant(Base):
    __tablename__ = "user_plants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # pode ter vindo do catálogo ou ser custom
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)
    catalog_id = Column(Integer, ForeignKey("plant_catalog.id"), nullable=True)

    stage = Column(String, nullable=False, default="DEVELOPMENT")  # DEVELOPMENT, FLOWERING etc.
