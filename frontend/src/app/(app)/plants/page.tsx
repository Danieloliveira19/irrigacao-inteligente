"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

function statusPill(status: string) {
  const base: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #ddd",
  };

  const s = status?.toUpperCase?.() ?? status;

  if (s === "OK") return <span style={{ ...base, background: "#eaffea" }}>OK</span>;
  if (s === "ALERT") return <span style={{ ...base, background: "#fff2cc" }}>Alerta</span>;
  if (s === "CRITICAL") return <span style={{ ...base, background: "#ffe6e6" }}>Crítico</span>;
  return <span style={base}>{status}</span>;
}

export default function PlantsPage() {
  const userId = 1;

  const [plants, setPlants] = useState<UserPlantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPlants() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/backend/users/${userId}/plants/`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Resposta inesperada (não é array).");

      setPlants(data);
    } catch (err: any) {
      setError(err?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Minhas Plantas</h1>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Lista de plantas cadastradas e seu status atual.
          </p>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={loadPlants}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </header>

      {loading ? (
        <p style={{ marginTop: 16 }}>Carregando...</p>
      ) : error ? (
        <>
          <p style={{ marginTop: 16, color: "crimson", fontWeight: 700 }}>Falha ao carregar</p>
          <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 10 }}>
            {error}
          </pre>
        </>
      ) : (
        <>
          <div style={{ marginTop: 18, opacity: 0.8 }}>
            <b>{plants.length}</b> cadastrada(s)
          </div>

          <div
            style={{
              marginTop: 12,
              border: "1px solid #e5e5e5",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f7f7f7" }}>
                  <th style={{ textAlign: "left", padding: 12 }}>Planta</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Estágio</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Status</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Última irrigação</th>
                  <th style={{ textAlign: "right", padding: 12 }}>ID</th>
                </tr>
              </thead>

              <tbody>
                {plants.map((p) => (
                  <tr key={p.user_plant_id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>
                      <Link
                        href={`/plants/${p.user_plant_id}`}
                        style={{ fontWeight: 800, textDecoration: "none" }}
                      >
                        {p.plant_name}
                      </Link>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>user_id: {p.user_id}</div>
                    </td>

                    <td style={{ padding: 12 }}>{p.stage}</td>
                    <td style={{ padding: 12 }}>{statusPill(p.status)}</td>
                    <td style={{ padding: 12 }}>{formatDateTimeBR(p.last_irrigation_at)}</td>
                    <td style={{ padding: 12, textAlign: "right", opacity: 0.75 }}>
                      #{p.user_plant_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
            Clique no nome da planta para abrir os detalhes.
          </p>
        </>
      )}
    </main>
  );
}
