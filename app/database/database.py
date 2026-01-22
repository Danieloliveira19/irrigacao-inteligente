from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Cria o arquivo irrigacao.db na raiz do projeto
SQLALCHEMY_DATABASE_URL = "sqlite:///./irrigacao.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # necessário para SQLite no FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
