export const endpoints = {
  // Dashboard / Eventos
  dashboard: (userId: number) => `/api/backend/dashboard/user/${userId}`,
  eventsByUser: (userId: number) => `/api/backend/events/user/${userId}`,
  eventsByPlant: (userPlantId: number) => `/api/backend/events/plant/${userPlantId}`,

  // User Plants (CONFIRMADO no Swagger)
  userPlants: (userId: number) => `/api/backend/users/${userId}/plants/`,
  addFromCatalog: (userId: number) => `/api/backend/users/${userId}/plants/from-catalog`,
  addCustomPlant: (userId: number) => `/api/backend/users/${userId}/plants/custom`,
  updateStage: (userId: number, userPlantId: number) =>
    `/api/backend/users/${userId}/plants/${userPlantId}/stage`,

  // Catálogo (CONFIRMADO no Swagger)
  catalogList: () => `/api/backend/plants/catalog/`,
  catalogSeed: () => `/api/backend/plants/catalog/seed`,
};
