from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.base import Base


class IrrigationRule(Base):
    __tablename__ = "irrigation_rules"

    id = Column(Integer, primary_key=True, index=True)

    plant_id = Column(
        Integer,
        ForeignKey("plants.id"),
        nullable=False,
        index=True
    )

    frequency_days = Column(Integer, nullable=False)
    water_ml = Column(Integer, nullable=False)
    period = Column(String, nullable=False)

    notes = Column(String, nullable=True)
