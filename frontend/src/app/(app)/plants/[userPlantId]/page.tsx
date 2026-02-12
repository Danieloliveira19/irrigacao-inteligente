"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type UserPlantListItem = {
  user_plant_id: number;
  user_id: number;
  plant_name: string;
  stage: string;
  status: string;
  last_irrigation_at: string | null;
};

function formatDateTimeBR(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR");
}

export default function PlantDetailPage() {
  const params = useParams<{ userPlantId: string }>();
  const userPlantId = Number(params.userPlantId);

  const userId = 1;

  const [plant, setPlant] = useState<UserPlantListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      // Por enquanto, reaproveita a lista e filtra pelo id
      const res = await fetch(`/api/backend/users/${userId}/plants/`, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as UserPlantListItem[];

      const found = data.find((x) => x.user_plant_id === userPlantId) ?? null;
      setPlant(found);
    } catch (err: any) {
      setError(err?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPlantId]);

  return (
    <main style={{ padding: 24 }}>
      <Link href="/plants" style={{ textDecoration: "none" }}>
        ← Voltar
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>Detalhes da planta</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <>
          <p style={{ color: "crimson", fontWeight: 700 }}>Erro</p>
          <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 10 }}>
            {error}
          </pre>
        </>
      ) : !plant ? (
        <p>Planta não encontrada (ID #{userPlantId}).</p>
      ) : (
        <div
          style={{
            marginTop: 12,
            border: "1px solid #e5e5e5",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900 }}>
            {plant.plant_name} <span style={{ opacity: 0.7 }}>#{plant.user_plant_id}</span>
          </div>

          <div style={{ marginTop: 10 }}>Estágio: <b>{plant.stage}</b></div>
          <div style={{ marginTop: 8 }}>Status: <b>{plant.status}</b></div>
          <div style={{ marginTop: 8 }}>
            Última irrigação: <b>{formatDateTimeBR(plant.last_irrigation_at)}</b>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            user_id: {plant.user_id}
          </div>

          <hr style={{ margin: "14px 0" }} />

          <p style={{ margin: 0, opacity: 0.8 }}>
            Próximos passos aqui: mostrar histórico (events) e dashboard (regras, necessidade de irrigação, etc.).
          </p>
        </div>
      )}
    </main>
  );
}
