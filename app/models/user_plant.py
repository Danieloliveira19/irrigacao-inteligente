from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class UserPlant(Base):
    __tablename__ = "user_plants"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plant_catalog_id = Column(Integer, ForeignKey("plant_catalog.id"), nullable=True)

    custom_name = Column(String, nullable=True)

    # GERMINATION | DEVELOPMENT | FLOWERING | FRUITING | HARVEST
    stage = Column(String, nullable=False, default="DEVELOPMENT")

    # relacionamentos
    user = relationship("User", back_populates="plants")
    catalog = relationship("PlantCatalog")

    # ✅ isso resolve exatamente o erro: "UserPlant has no property 'rules'"
    rules = relationship(
        "IrrigationRule",
        back_populates="user_plant",
        cascade="all, delete-orphan",
    )
