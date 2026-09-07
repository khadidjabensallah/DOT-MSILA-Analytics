// Central API configuration — set VITE_API_URL in your hosting environment.
// Falls back to localhost for local development.
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
