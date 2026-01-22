from pydantic import BaseModel

class PlantCreate(BaseModel):
    name: str
    category: str

class PlantResponse(BaseModel):
    id: int
    name: str
    category: str

    class Config:
        from_attributes = True  # permite converter SQLAlchemy -> Pydantic
