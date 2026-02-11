// frontend/src/lib/config.ts
export const APP_CONFIG = {
  // true = usa mock; false = usa API via /api/backend/...
  offlineMock: process.env.NEXT_PUBLIC_OFFLINE_MOCK === "true",

  // usuário default do MVP
  userIdDefault: Number(process.env.NEXT_PUBLIC_USER_ID || 1),
};
