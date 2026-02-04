// frontend/src/app/rules/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { APP_CONFIG } from "@/lib/config";
import { getMockPlants } from "@/lib/mock/plants";
import { getMockRulesByPlant } from "@/lib/mock/rules";
import { OfflineBanner } from "@/components/common/offline-banner";
import { Toggle } from "@/components/ui/toggle";

type PlantRow = {
  user_plant_id: number;
  plant_name: string;
  stage: string;
  status: string;
};

type RuleRow = {
  rule_id: number;
  user_plant_id: number;
  name: string;
  enabled: boolean;
  schedule: string;
  target_ml?: number;
};

function stageLabel(stage: string) {
  if (stage === "SEEDLING") return "Muda";
  if (stage === "VEGETATIVE") return "Vegetativo";
  if (stage === "FLOWERING") return "Floração";
  if (stage === "FRUITING") return "Frutificação";
  return stage;
}

export default function RulesPage() {
  const userId = APP_CONFIG.userIdDefault;

  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState<PlantRow[]>([]);
  const [rulesByPlant, setRulesByPlant] = useState<Record<number, RuleRow[]>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const p = await getMockPlants(userId);

      const plantRows: PlantRow[] = p.map((x) => ({
        user_plant_id: x.user_plant_id,
        plant_name: x.plant_name,
        stage: x.stage,
        status: x.status,
      }));

      const rulesMap: Record<number, RuleRow[]> = {};
      for (const plant of plantRows) {
        const r = await getMockRulesByPlant(plant.user_plant_id);
        rulesMap[plant.user_plant_id] = r.map((rr) => ({ ...rr }));
      }

      if (!mounted) return;

      setPlants(plantRows);
      setRulesByPlant(rulesMap);

      // por padrão, abre a primeira planta
      if (plantRows.length > 0) {
        setExpanded({ [plantRows[0].user_plant_id]: true });
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const totalRules = useMemo(() => {
    return Object.values(rulesByPlant).reduce((acc, list) => acc + list.length, 0);
  }, [rulesByPlant]);

  function toggleExpanded(userPlantId: number) {
    setExpanded((prev) => ({ ...prev, [userPlantId]: !prev[userPlantId] }));
  }

  function toggleRule(userPlantId: number, ruleId: number, enabled: boolean) {
    setRulesByPlant((prev) => {
      const next = { ...prev };
      next[userPlantId] = (next[userPlantId] ?? []).map((r) =>
        r.rule_id === ruleId ? { ...r, enabled } : r
      );
      return next;
    });
  }

  return (
    <div className="space-y-4 text-zinc-900">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Regras</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie regras de irrigação por planta (mock).
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          Usuário: <span className="font-medium text-zinc-900">#{userId}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Resumo</h3>
            <p className="mt-1 text-sm text-zinc-500">
              {plants.length} planta(s) • {totalRules} regra(s)
            </p>
          </div>

          {loading ? (
            <div className="text-sm text-zinc-500">Carregando…</div>
          ) : null}
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-sm text-zinc-500">Carregando regras…</div>
          ) : plants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
              <p className="text-sm text-zinc-500">Nenhuma planta cadastrada.</p>
            </div>
          ) : (
            plants.map((p) => {
              const isOpen = !!expanded[p.user_plant_id];
              const rules = rulesByPlant[p.user_plant_id] ?? [];

              return (
                <div key={p.user_plant_id} className="rounded-xl border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(p.user_plant_id)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900">{p.plant_name}</span>
                        <span className="text-xs text-zinc-400">#{p.user_plant_id}</span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Estágio: {stageLabel(p.stage)} • Status: {p.status}
                      </div>
                    </div>

                    <div className="text-sm text-zinc-500">
                      {rules.length} regra(s) {isOpen ? "▲" : "▼"}
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-zinc-100 p-4">
                      {rules.length === 0 ? (
                        <div className="text-sm text-zinc-500">Sem regras para esta planta.</div>
                      ) : (
                        <div className="space-y-3">
                          {rules.map((r) => (
                            <div
                              key={r.rule_id}
                              className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-3 md:flex-row md:items-center md:justify-between"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-zinc-900">{r.name}</span>
                                  <span className="text-xs text-zinc-400">rule #{r.rule_id}</span>
                                </div>

                                <div className="mt-1 text-sm text-zinc-600">
                                  Agenda: <span className="font-medium">{r.schedule}</span>
                                  {typeof r.target_ml === "number" ? (
                                    <>
                                      {" "}
                                      • Alvo: <span className="font-medium">{r.target_ml} ml</span>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3 md:justify-end">
                                <Toggle
                                  checked={r.enabled}
                                  onChange={(v) => toggleRule(p.user_plant_id, r.rule_id, v)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-zinc-100 p-4 text-xs text-zinc-500">
          Nesta fase o toggle altera só no frontend (mock). Depois conectamos na API real.
        </div>
      </div>
    </div>
  );
}
