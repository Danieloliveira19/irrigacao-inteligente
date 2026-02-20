"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Droplets, Sun, Clock } from "lucide-react";

type CatalogPlant = {
  id: number;
  name: string;
  water: string;
  sun: string;
  cycle: string;
  stages: string[];
  emoji: string;
};

const catalog: CatalogPlant[] = [
  { id: 1, name: "Alface", water: "Média", sun: "Parcial", cycle: "30-45 dias", stages: ["Germinação", "Crescimento", "Colheita"], emoji: "🥬" },
  { id: 2, name: "Tomate", water: "Alta", sun: "Pleno sol", cycle: "90-120 dias", stages: ["Germinação", "Crescimento", "Floração", "Frutificação", "Colheita"], emoji: "🍅" },
  { id: 3, name: "Cenoura", water: "Baixa", sun: "Pleno sol", cycle: "70-90 dias", stages: ["Germinação", "Crescimento", "Engrossamento", "Colheita"], emoji: "🥕" },
  { id: 4, name: "Pimentão", water: "Média", sun: "Pleno sol", cycle: "90-120 dias", stages: ["Germinação", "Crescimento", "Floração", "Frutificação", "Colheita"], emoji: "🫑" },
  { id: 5, name: "Rúcula", water: "Média", sun: "Parcial", cycle: "25-35 dias", stages: ["Germinação", "Crescimento", "Colheita"], emoji: "🥗" },
  { id: 6, name: "Couve", water: "Média", sun: "Parcial", cycle: "60-80 dias", stages: ["Germinação", "Crescimento", "Colheita"], emoji: "🥬" },
  { id: 7, name: "Morango", water: "Alta", sun: "Pleno sol", cycle: "60-90 dias", stages: ["Mudas", "Crescimento", "Floração", "Frutificação", "Colheita"], emoji: "🍓" },
  { id: 8, name: "Pepino", water: "Alta", sun: "Pleno sol", cycle: "50-70 dias", stages: ["Germinação", "Crescimento", "Floração", "Colheita"], emoji: "🥒" },
];

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<number[]>([]);

  const filtered = catalog.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Catálogo de Plantas 📚
        </h1>
        <p className="text-muted-foreground mt-1">
          Escolha as culturas que deseja adicionar ao seu cultivo
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar no catálogo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((plant) => {
          const isAdded = added.includes(plant.id);

          return (
            <Card key={plant.id} className="card-interactive">
              <CardContent className="p-5">
                <div className="text-center mb-4">
                  <span className="text-4xl">{plant.emoji}</span>
                  <h3 className="font-display font-semibold text-foreground mt-2">
                    {plant.name}
                  </h3>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4 text-info" />
                    <span>Água: {plant.water}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sun className="h-4 w-4 text-warning" />
                    <span>{plant.sun}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Ciclo: {plant.cycle}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {plant.stages.map((s) => (
                    <Badge key={s} variant="blue" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="w-full gap-2"
                  variant={isAdded ? "secondary" : "default"}
                  size="sm"
                  onClick={() =>
                    setAdded((prev) =>
                      prev.includes(plant.id) ? prev : [...prev, plant.id]
                    )
                  }
                >
                  {isAdded ? (
                    "✓ Adicionado"
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Adicionar ao meu cultivo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
