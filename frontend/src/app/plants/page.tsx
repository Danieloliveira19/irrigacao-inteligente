// frontend/src/app/plants/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { APP_CONFIG } from "@/lib/config";
import { getMockPlants } from "@/lib/mock/plants";
import { OfflineBanner } from "@/components/common/offline-banner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function stageLabel(stage: string) {
  if (stage === "SEEDLING") return "Muda";
  if (stage === "VEGETATIVE") return "Vegetativo";
  if (stage === "FLOWERING") return "Floração";
  if (stage === "FRUITING") return "Frutificação";
  return stage;
}

function statusLabel(status: string) {
  if (status === "OK") return "OK";
  if (status === "NEEDS_WATER") return "Precisa irrigar";
  return "Alerta";
}

function statusPill(status: string) {
  if (status === "OK") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "NEEDS_WATER")
    return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

export default function PlantsPage() {
  const userId = APP_CONFIG.userIdDefault;
  const router = useRouter();

  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getMockPlants(userId);
      setPlants(data);
      setLoading(false);
    })();
  }, [userId]);

  return (
    <div className="space-y-4 text-zinc-900">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Minhas Plantas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Lista de plantas cadastradas e seu status atual.
          </p>
        </div>

        <Button onClick={() => router.push("/catalog")}>
          Adicionar planta
        </Button>
      </div>

      {/* Conteúdo */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-4">
          <h3 className="text-base font-semibold text-zinc-900">Plantas</h3>
          <p className="mt-1 text-sm text-zinc-500">
            {loading ? "Carregando…" : `${plants.length} cadastrada(s)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-500">
            Carregando plantas…
          </div>
        ) : plants.length === 0 ? (
          <div className="p-10 text-center">
            <h4 className="text-base font-semibold">Nenhuma planta cadastrada 🌱</h4>
            <p className="mt-2 text-sm text-zinc-500">
              Comece adicionando plantas pelo catálogo.
            </p>
            <div className="mt-4">
              <Button onClick={() => router.push("/catalog")}>
                Ir para o catálogo
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left text-sm text-zinc-600">
                  <th className="px-4 py-3 font-medium">Planta</th>
                  <th className="px-4 py-3 font-medium">Estágio</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Última irrigação</th>
                  <th className="px-4 py-3 font-medium text-right">ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {plants.map((p) => (
                  <tr key={p.user_plant_id} className="text-sm">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-zinc-900">
                        {p.plant_name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        user_id: {p.user_id}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-zinc-700">
                      {stageLabel(p.stage)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusPill(
                          p.status
                        )}`}
                      >
                        {statusLabel(p.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-zinc-700">
                      {formatDateTime(p.last_irrigation_at)}
                    </td>

                    <td className="px-4 py-3 text-right text-zinc-500">
                      #{p.user_plant_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-zinc-100 p-4 text-xs text-zinc-500">
          Próximo passo: editar estágio, ver regras e histórico da planta.
        </div>
      </div>
    </div>
  );
}
