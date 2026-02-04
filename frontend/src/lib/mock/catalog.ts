// frontend/src/lib/mock/catalog.ts
export type CatalogPlantDTO = {
  catalog_id: number;
  name: string;
  category: "Hortaliça" | "Erva" | "Fruta";
  difficulty: "Fácil" | "Média" | "Difícil";
  irrigation_hint: string; // dica simples
  notes?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Catálogo mock (depois vira API real)
const CATALOG: CatalogPlantDTO[] = [
  {
    catalog_id: 1,
    name: "Alface",
    category: "Hortaliça",
    difficulty: "Fácil",
    irrigation_hint: "Irrigação leve diária, evitar encharcar.",
    notes: "Prefere clima ameno; colheita rápida.",
  },
  {
    catalog_id: 2,
    name: "Tomate",
    category: "Fruta",
    difficulty: "Média",
    irrigation_hint: "Irrigar 2–3x por semana (ajustar por clima).",
    notes: "Evitar molhar folhas; atenção a pragas.",
  },
  {
    catalog_id: 3,
    name: "Manjericão",
    category: "Erva",
    difficulty: "Fácil",
    irrigation_hint: "Manter úmido, sem encharcar.",
    notes: "Boa luz; podas ajudam no crescimento.",
  },
  {
    catalog_id: 4,
    name: "Cebolinha",
    category: "Erva",
    difficulty: "Fácil",
    irrigation_hint: "Irrigar 3–4x por semana.",
    notes: "Rebrote fácil após cortes.",
  },
  {
    catalog_id: 5,
    name: "Rúcula",
    category: "Hortaliça",
    difficulty: "Fácil",
    irrigation_hint: "Irrigação leve e constante.",
    notes: "Ciclo curto; sabor intensifica no calor.",
  },
  {
    catalog_id: 6,
    name: "Morango",
    category: "Fruta",
    difficulty: "Difícil",
    irrigation_hint: "Irrigar pouco e frequente; evitar umidade excessiva.",
    notes: "Exige manejo e proteção contra fungos.",
  },
];

export async function getMockCatalog(): Promise<CatalogPlantDTO[]> {
  await sleep(200);
  return [...CATALOG].sort((a, b) => a.name.localeCompare(b.name));
}
