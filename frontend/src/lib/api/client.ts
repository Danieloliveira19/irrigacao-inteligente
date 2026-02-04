import axios from "axios";

/**
 * Agora o browser chama SEMPRE o próprio Next:
 * /api/... (mesma origem) -> sem CORS
 */
export const API_BASE_URL = "";

// axios vai bater no Next (ex: http://localhost:3000/api/...)
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
