// frontend/src/lib/mock/events.ts
import { mockDb, type EventDTO } from "./db";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retorna eventos mockados do usuário.
 * (Depois: essa função vira um fetch na API real, mantendo o mesmo retorno)
 */
export async function getMockEvents(userId: number): Promise<EventDTO[]> {
  // simula latência de rede
  await sleep(250);

  const list = mockDb.eventsByUser.get(userId) ?? [];

  // ordena do mais recente para o mais antigo
  return [...list].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}
