// frontend/src/app/catalog/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_CONFIG } from "@/lib/config";
import { getMockCatalog, type CatalogPlantDTO } from "@/lib/mock/catalog";
import { OfflineBanner } from "@/components/common/offline-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

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
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState<CatalogPlantDTO[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<"Todas" | CatalogPlantDTO["category"]>("Todas");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getMockCatalog();
      if (!mounted) return;
      setAll(data);
      setLoading(false);
    })();
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
    toast(`"${plant.name}" adicionada ao sistema`, "success", {
      label: "Ver plantas",
      onClick: () => router.push("/plants"),
    });
  }

  return (
    <div className="space-y-4 text-zinc-900">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Catálogo</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Escolha uma planta para adicionar ao sistema.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          Usuário: <span className="font-medium">#{userId}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-3 h-3 w-1/3" />
              <Skeleton className="mt-4 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-5/6" />
              <Skeleton className="mt-6 h-8 w-24" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h4 className="text-base font-semibold">Nada por aqui ainda 🌱</h4>
          <p className="mt-2 text-sm text-zinc-500">
            Tente outro nome ou ajuste os filtros.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.catalog_id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-base font-semibold">{p.name}</h3>
              <div className="mt-2 flex gap-2">
                {categoryBadge(p.category)}
                {difficultyBadge(p.difficulty)}
              </div>

              <p className="mt-3 text-sm text-zinc-600">
                {p.irrigation_hint}
              </p>

              <div className="mt-4 flex justify-end">
                <Button onClick={() => onAdd(p)}>Adicionar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
