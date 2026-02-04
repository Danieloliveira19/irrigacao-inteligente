// frontend/src/lib/config.ts
export const APP_CONFIG = {
  // 1 = usa mock (offline). 0 = futuro: usa API real.
  offlineMock: process.env.NEXT_PUBLIC_OFFLINE_MOCK === "1",
  userIdDefault: Number(process.env.NEXT_PUBLIC_USER_ID ?? "1"),
};
