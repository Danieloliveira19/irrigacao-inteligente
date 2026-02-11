// frontend/src/lib/api/client.ts
import axios from "axios";

/**
 * Aqui o browser chama SEMPRE o próprio Next:
 * /api/backend/... (mesma origem) -> sem CORS
 */
export const api = axios.create({
  baseURL: "",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
