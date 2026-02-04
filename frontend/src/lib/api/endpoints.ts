export const endpoints = {
  dashboard: (userId: number) => `/api/dashboard/user/${userId}`,
  eventsByUser: (userId: number) => `/api/events/user/${userId}`,
};
