// frontend/src/lib/mock/plants.ts
import { mockDb, type PlantDTO } from "./db";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMockPlants(userId: number): Promise<PlantDTO[]> {
  await sleep(200);

  const list = mockDb.plantsByUser.get(userId) ?? [];

  // ordem: NEEDS_WATER primeiro, depois ALERT, depois OK; e por nome
  const weight = (s: PlantDTO["status"]) => (s === "NEEDS_WATER" ? 0 : s === "ALERT" ? 1 : 2);

  return [...list].sort((a, b) => {
    const wa = weight(a.status);
    const wb = weight(b.status);
    if (wa !== wb) return wa - wb;
    return a.plant_name.localeCompare(b.plant_name);
  });
}
