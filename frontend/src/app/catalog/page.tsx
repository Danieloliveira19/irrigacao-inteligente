// frontend/src/app/catalog/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { APP_CONFIG } from "@/lib/config";
import { getMockCatalog, type CatalogPlantDTO } from "@/lib/mock/catalog";
import { OfflineBanner } from "@/components/common/offline-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function difficultyBadge(d: CatalogPlantDTO["difficulty"]) {
  if (d === "Fácil") return <Badge variant="green">Fácil</Badge>;
  if (d === "Média") return <Badge variant="amber">Média</Badge>;
  return <Badge variant="rose">Difícil</Badge>;
}

function categoryBadge(c: CatalogPlantDTO["category"]) {
  if (c === "Hortaliça") return <Badge variant="blue">Hortaliça</Badge>;
  if (c === "Erva") return <Badge variant="default">Erva</Badge>;
  return <Badge variant="amber">Fruta</Badge>;
}

export default function CatalogPage() {
  const userId = APP_CONFIG.userIdDefault;

  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState<CatalogPlantDTO[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Todas" | CatalogPlantDTO["category"]>("Todas");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const data = await getMockCatalog();
      if (!mounted) return;
      setAll(data);
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((p) => {
      const byCategory = category === "Todas" ? true : p.category === category;
      const byQuery = q === "" ? true : p.name.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [all, query, category]);

  function onAdd(plant: CatalogPlantDTO) {
    // Mock: no futuro aqui chamaremos a API real para criar user_plant a partir do catálogo
    alert(`(Mock) Adicionar ao usuário #${userId}: ${plant.name}`);
  }

  return (
    <div className="space-y-4 text-zinc-900">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Catálogo</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Escolha uma planta para adicionar ao seu sistema.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          Usuário: <span className="font-medium text-zinc-900">#{userId}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-zinc-600">Buscar por nome</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: alface, tomate, manjericão..."
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-600">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            >
              <option value="Todas">Todas</option>
              <option value="Hortaliça">Hortaliça</option>
              <option value="Erva">Erva</option>
              <option value="Fruta">Fruta</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          {loading ? "Carregando catálogo…" : `${filtered.length} resultado(s)`}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
          Carregando…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h4 className="text-base font-semibold text-zinc-900">Nada encontrado</h4>
          <p className="mt-2 text-sm text-zinc-500">Tente outro nome ou mude a categoria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.catalog_id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-zinc-900">{p.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {categoryBadge(p.category)}
                    {difficultyBadge(p.difficulty)}
                  </div>
                </div>
                <div className="text-xs text-zinc-400">#{p.catalog_id}</div>
              </div>

              <div className="mt-3 text-sm text-zinc-700">
                <div className="font-medium text-zinc-900">Irrigação</div>
                <p className="mt-1 text-zinc-600">{p.irrigation_hint}</p>
              </div>

              {p.notes ? (
                <div className="mt-3 text-sm text-zinc-700">
                  <div className="font-medium text-zinc-900">Observações</div>
                  <p className="mt-1 text-zinc-600">{p.notes}</p>
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={() => alert("(Mock) Abrir detalhes")}>
                  Detalhes
                </Button>
                <Button onClick={() => onAdd(p)}>Adicionar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
