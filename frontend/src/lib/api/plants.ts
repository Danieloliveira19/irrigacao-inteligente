// frontend/src/lib/api/plants.ts
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export type UserPlantDTO = {
  user_plant_id: number;
  user_id: number;
  plant_name: string;
  stage: string;
  status: "OK" | "NEEDS_WATER" | "ALERT";
  last_irrigation_at: string | null;
};

export async function getUserPlants(userId: number): Promise<UserPlantDTO[]> {
  const res = await api.get(endpoints.userPlants(userId));
  return res.data as UserPlantDTO[];
}
