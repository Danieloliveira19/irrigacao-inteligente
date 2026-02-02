from sqlalchemy import Column, Integer, Float, Boolean, ForeignKey, String
from app.database.base import Base


class IrrigationRule(Base):
    __tablename__ = "irrigation_rules"

    id = Column(Integer, primary_key=True, index=True)
    user_plant_id = Column(Integer, ForeignKey("user_plants.id"), nullable=False, index=True)

    # estágio em que a regra vale (opcional)
    stage = Column(String, nullable=True)

    # ===== Regras já existentes no seu projeto =====
    # Irrigar quando a umidade atual estiver ABAIXO desse percentual
    threshold_percent = Column(Float, nullable=False, default=30.0)

    # Duração da irrigação (minutos)
    duration_minutes = Column(Integer, nullable=False, default=20)

    # Intervalo mínimo entre irrigações (minutos) -> isso já é o COOLDOWN
    min_interval_minutes = Column(Integer, nullable=False, default=60)

    # Regra ativa/desativa
    enabled = Column(Boolean, nullable=False, default=True)

    # ===== NOVAS REGRAS (PACOTE MÍNIMO) =====
    # Se chover >= este valor (mm), NÃO irrigar
    rain_skip_mm = Column(Float, nullable=False, default=1.0)

    # Se a umidade atual >= este valor (%), NÃO irrigar
    # (Serve como trava extra para evitar irrigar quando já está “molhado”)
    moisture_stop_percent = Column(Float, nullable=False, default=60.0)
