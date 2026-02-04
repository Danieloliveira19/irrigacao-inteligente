// frontend/src/lib/mock/rules.ts
import { mockDb, type RuleDTO } from "./db";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMockRulesByPlant(userPlantId: number): Promise<RuleDTO[]> {
  await sleep(150);
  return mockDb.rulesByPlant.get(userPlantId) ?? [];
}
