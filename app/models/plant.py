from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    default_threshold_percent = Column(Float, nullable=False, default=30.0)
    default_duration_minutes = Column(Integer, nullable=False, default=20)
