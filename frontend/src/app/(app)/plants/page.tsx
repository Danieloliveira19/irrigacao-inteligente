"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, Plus, Sprout, Trash2, CheckCircle2 } from "lucide-react";

type PlantStatus = "OK" | "ALERT" | "NEEDS_WATER";

type UserPlant = {
  id: number;
  name: string;
  stage: string; // Germinação/Crescimento...
  waterNeed: string; // Baixa/Média/Alta
  status: PlantStatus;
  plantedDays: number;
};

const MOCK_PLANTS: UserPlant[] = [
  {
    id: 1,
    name: "Alface",
    stage: "Germinação",
    waterNeed: "Média",
    status: "OK",
    plantedDays: 0,
  },
  // Se quiser simular mais, descomente:
  // { id: 2, name: "Tomate", stage: "Crescimento", waterNeed: "Alta", status: "NEEDS_WATER", plantedDays: 12 },
  // { id: 3, name: "Manjericão", stage: "Vegetativo", waterNeed: "Média", status: "ALERT", plantedDays: 5 },
];

function statusPill(status: PlantStatus) {
  if (status === "OK") {
    return {
      label: "OK",
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    };
  }
  if (status === "NEEDS_WATER") {
    return {
      label: "Precisa de água",
      className:
        "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    };
  }
  return {
    label: "Alerta",
    className: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
}

export default function PlantsPage() {
  const [search, setSearch] = useState("");
  const [plants, setPlants] = useState<UserPlant[]>(MOCK_PLANTS);

  const filtered = useMemo(() => {
    return plants.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [plants, search]);

  const countLabel = `${plants.length} planta${plants.length === 1 ? "" : "s"} cadastrada${plants.length === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header (igual Lovable) */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Minhas Plantas 🌱
          </h1>
          <p className="text-muted-foreground mt-1">{countLabel}</p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/catalog">
            <Plus className="h-4 w-4" />
            Nova Planta
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar planta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty / List */}
      {plants.length === 0 ? (
        <Card className="card">
          <CardContent className="p-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                  <Sprout className="h-5 w-5 text-emerald-700" />
                </span>

                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Nenhuma planta cadastrada
                  </h2>
                  <p className="text-muted-foreground">
                    Adicione plantas pelo catálogo para acompanhar estágio,
                    necessidades e histórico.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild className="gap-2">
                  <Link href="/catalog">
                    <Plus className="h-4 w-4" />
                    Ir para o Catálogo
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Container estreito alinhado à esquerda (igual ao print do Lovable) */}
          <div className="max-w-2xl">
            {filtered.map((p) => {
              const pill = statusPill(p.status);

              return (
                <Card key={p.id} className="card mb-4">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                            <Sprout className="h-5 w-5 text-emerald-700" />
                          </span>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-lg font-semibold">
                                {p.name}
                              </h3>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {p.plantedDays} dia{p.plantedDays === 1 ? "" : "s"} plantado
                            </p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                            pill.className
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {pill.label}
                        </span>
                      </div>

                      {/* Details 2 linhas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Estágio</span>
                          <Badge variant="blue">{p.stage}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Necessidade de água
                          </span>
                          <span className="font-medium text-foreground">
                            {p.waterNeed}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setPlants((prev) => prev.filter((x) => x.id !== p.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Nenhum resultado da busca */}
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma planta encontrada com “{search}”.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}