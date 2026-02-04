// frontend/src/lib/mock/db.ts
// Banco mock centralizado do frontend (sem API real por enquanto)

export type DashboardDTO = {
  user_id: number;
  date: string; // YYYY-MM-DD
  total_plants: number;
  needs_irrigation: number;
  irrigated_today: number;
  next_actions: {
    user_plant_id: number;
    plant_name: string;
    action: string;
    when: string;
  }[];
};

export type EventDTO = {
  id: number;
  user_id: number;
  user_plant_id: number;
  plant_name: string;
  event_type: "IRRIGATION" | "SENSOR" | "RULE_APPLIED";
  created_at: string; // ISO string
  details?: string;
};

export type PlantDTO = {
  user_plant_id: number;
  user_id: number;
  plant_name: string;
  stage: "SEEDLING" | "VEGETATIVE" | "FLOWERING" | "FRUITING";
  status: "OK" | "NEEDS_WATER" | "ALERT";
  last_irrigation_at?: string; // ISO string
};

export type RuleDTO = {
  rule_id: number;
  user_plant_id: number;
  name: string;
  enabled: boolean;
  schedule: string; // ex: "daily", "each 2 days"
  target_ml?: number;
};

function isoHoursAgo(hoursAgo: number) {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
}

function todayYMD() {
  return new Date().toISOString().slice(0, 10);
}

// "Banco" mock (mapas por usuário). Depois trocamos os "getMock*" por API real.
export const mockDb = {
  dashboardByUser: new Map<number, DashboardDTO>([
    [
      1,
      {
        user_id: 1,
        date: todayYMD(),
        total_plants: 3,
        needs_irrigation: 1,
        irrigated_today: 1,
        next_actions: [
          { user_plant_id: 101, plant_name: "Alface", action: "Irrigar 300ml", when: "Hoje 18:00" },
          { user_plant_id: 102, plant_name: "Tomate", action: "Checar umidade", when: "Amanhã 08:00" },
        ],
      },
    ],
  ]),

  eventsByUser: new Map<number, EventDTO[]>([
    [
      1,
      [
        {
          id: 9001,
          user_id: 1,
          user_plant_id: 101,
          plant_name: "Alface",
          event_type: "IRRIGATION",
          created_at: isoHoursAgo(2),
          details: "Irrigação registrada: 300ml",
        },
        {
          id: 9002,
          user_id: 1,
          user_plant_id: 102,
          plant_name: "Tomate",
          event_type: "RULE_APPLIED",
          created_at: isoHoursAgo(8),
          details: "Regra aplicada: irrigar a cada 2 dias (vegetativo)",
        },
        {
          id: 9003,
          user_id: 1,
          user_plant_id: 103,
          plant_name: "Manjericão",
          event_type: "SENSOR",
          created_at: isoHoursAgo(26),
          details: "Leitura de umidade: 41%",
        },
      ],
    ],
  ]),

  plantsByUser: new Map<number, PlantDTO[]>([
    [
      1,
      [
        {
          user_plant_id: 101,
          user_id: 1,
          plant_name: "Alface",
          stage: "VEGETATIVE",
          status: "OK",
          last_irrigation_at: isoHoursAgo(2),
        },
        {
          user_plant_id: 102,
          user_id: 1,
          plant_name: "Tomate",
          stage: "FLOWERING",
          status: "NEEDS_WATER",
          last_irrigation_at: isoHoursAgo(50),
        },
        {
          user_plant_id: 103,
          user_id: 1,
          plant_name: "Manjericão",
          stage: "VEGETATIVE",
          status: "ALERT",
          last_irrigation_at: isoHoursAgo(80),
        },
      ],
    ],
  ]),

  rulesByPlant: new Map<number, RuleDTO[]>([
    [
      101,
      [
        { rule_id: 5001, user_plant_id: 101, name: "Irrigação diária leve", enabled: true, schedule: "daily", target_ml: 250 },
      ],
    ],
    [
      102,
      [
        { rule_id: 5002, user_plant_id: 102, name: "Irrigar a cada 2 dias", enabled: true, schedule: "each 2 days", target_ml: 500 },
        { rule_id: 5003, user_plant_id: 102, name: "Evitar irrigação se chuva", enabled: true, schedule: "conditional", target_ml: 0 },
      ],
    ],
    [
      103,
      [
        { rule_id: 5004, user_plant_id: 103, name: "Irrigar 3x por semana", enabled: false, schedule: "3x week", target_ml: 200 },
      ],
    ],
  ]),
};
