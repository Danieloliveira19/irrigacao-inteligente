from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class UserPlant(Base):
    __tablename__ = "user_plants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # se veio do catálogo, preenche; se for custom, pode ser null
    plant_catalog_id = Column(Integer, ForeignKey("plant_catalog.id"), nullable=True, index=True)

    custom_name = Column(String, nullable=True)

    # fase atual da planta
    stage = Column(String, nullable=False, default="DEVELOPMENT")

    user = relationship("User", back_populates="plants")
    plant_catalog = relationship("PlantCatalog", back_populates="user_plants")

    irrigation_rules = relationship(
        "IrrigationRule",
        back_populates="user_plant",
        cascade="all, delete-orphan",
    )

    events = relationship(
        "IrrigationEvent",
        back_populates="user_plant",
        cascade="all, delete-orphan",
    )
