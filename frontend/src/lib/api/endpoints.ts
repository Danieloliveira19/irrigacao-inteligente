export const endpoints = {
  dashboard: (userId: number) => `/dashboard/user/${userId}`,
  eventsByUser: (userId: number) => `/events/user/${userId}`,
};
