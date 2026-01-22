from sqlalchemy import Column, Integer, String
from app.database.base import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)  # ex: "hortaliça", "fruta"
