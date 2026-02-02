from __future__ import annotations

import sys
from typing import Any, Optional

from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)

# =====================
# CONFIG DEMO
# =====================
DEMO_EMAIL = "demo@irrigacao.local"
DEMO_NAME = "Usuário Demo"
DEMO_PASSWORD = "123456"
DEMO_PLANT_NICKNAME = "Minha Planta (demo)"
DEFAULT_STAGE = "vegetative"  # ajuste se necessário


# =====================
# HELPERS HTTP
# =====================
def req(method: str, url: str, payload: Optional[dict] = None, ok=(200, 201)):
    r = client.request(method, url, json=payload)
    if r.status_code not in ok:
        raise RuntimeError(f"{method} {url} -> {r.status_code}: {r.text}")
    return r.json() if r.content else None


def try_get(urls: list[str]):
    last_error = None
    for url in urls:
        try:
            return req("GET", url)
        except Exception as e:
            last_error = e
    raise RuntimeError(f"Falha em todas as rotas GET {urls}. Último erro: {last_error}")


# =====================
# STEPS SEED
# =====================
def ensure_user() -> dict[str, Any]:
    print("1) Criando/localizando usuário demo...")

    payload = {
        "name": DEMO_NAME,
        "email": DEMO_EMAIL,
        "password": DEMO_PASSWORD,
    }

    try:
        return req("POST", "/users/", payload)
    except Exception:
        users = try_get(["/users/", "/users"])
        for u in users:
            if u.get("email") == DEMO_EMAIL:
                return u

        raise RuntimeError("Usuário demo não encontrado e não pôde ser criado.")


def seed_catalog():
    print("2) Seed catálogo...")
    return req("POST", "/plants/catalog/seed", {})


def get_first_catalog_item() -> dict[str, Any]:
    print("3) Pegando primeiro item do catálogo...")
    catalog = try_get(["/plants/catalog/", "/plants/catalog"])

    if not isinstance(catalog, list) or not catalog:
        raise RuntimeError("Catálogo vazio após seed.")

    return catalog[0]


def create_user_plant_from_catalog(user_id: int, catalog_id: int) -> dict[str, Any]:
    print("4) Criando user plant a partir do catálogo...")

    payload = {
        "catalog_id": catalog_id,
        "nickname": DEMO_PLANT_NICKNAME,
    }

    return req("POST", f"/users/{user_id}/plants/from-catalog", payload)


def set_stage(user_id: int, user_plant_id: int):
    print("5) Definindo estágio da planta...")

    payload = {"stage": DEFAULT_STAGE}
    return req("PUT", f"/users/{user_id}/plants/{user_plant_id}/stage", payload)


def create_sensor_reading(user_id: int, user_plant_id: int):
    print("6) Criando leitura de sensor (fake)...")

    payload = {
        "soil_moisture": 35.0,
        "air_temperature": 27.0,
        "air_humidity": 60.0,
        "rain_mm": 0.0,
    }

    return req(
        "POST",
        f"/users/{user_id}/plants/{user_plant_id}/sensor-reading",
        payload,
    )


def run_engine():
    print("7) Executando engine de irrigação...")
    return req("POST", "/engine/run", {})


def show_results(user_id: int, user_plant_id: int):
    print("8) Buscando eventos e dashboard...")

    events_user = req("GET", f"/events/user/{user_id}")
    events_plant = req("GET", f"/events/plant/{user_plant_id}")
    dashboard = req("GET", f"/dashboard/user/{user_id}")

    print("\n===== RESULTADO FINAL =====")
    print(f"User ID: {user_id}")
    print(f"UserPlant ID: {user_plant_id}")
    print(f"Eventos do usuário: {len(events_user)}")
    print(f"Eventos da planta: {len(events_plant)}")
    print("Dashboard:")
    print(dashboard)


# =====================
# MAIN
# =====================
def main():
    user = ensure_user()
    user_id = user["id"]

    seed_catalog()
    catalog_item = get_first_catalog_item()
    catalog_id = catalog_item["id"]

    user_plant = create_user_plant_from_catalog(user_id, catalog_id)
    user_plant_id = user_plant["id"]

    set_stage(user_id, user_plant_id)

    try:
        create_sensor_reading(user_id, user_plant_id)
    except Exception as e:
        print(f"(sensor-reading ignorado: {e})")

    run_engine()
    show_results(user_id, user_plant_id)

    print("\n✅ SEED FINALIZADO COM SUCESSO!")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("\n❌ ERRO NO SEED")
        print(e)
        sys.exit(1)
