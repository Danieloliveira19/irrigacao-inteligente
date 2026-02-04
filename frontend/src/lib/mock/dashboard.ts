// frontend/src/lib/mock/dashboard.ts
import { mockDb, type DashboardDTO } from "./db";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retorna dashboard mockado do usuário.
 * (Depois: essa função vira um fetch na API real, mantendo o mesmo retorno)
 */
export async function getMockDashboard(userId: number): Promise<DashboardDTO | null> {
  await sleep(250);
  return mockDb.dashboardByUser.get(userId) ?? null;
}
