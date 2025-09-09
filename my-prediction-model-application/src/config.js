// Global configuration for the frontend-only MVP
// Purpose: Centralize API keys and backend endpoints. Replace placeholders or set Vite env vars.

export const CONFIG = {
  // Prefer setting Vite env variables in deployment: VITE_BUILDER_API_KEY, VITE_BACKEND_BASE_URL
  BUILDER_API_KEY: import.meta.env.VITE_BUILDER_API_KEY || 'YOUR_BUILDER_IO_API_KEY',
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL || 'https://your-backend.example.com',
  ENDPOINTS: {
    // GET `${BACKEND_BASE_URL}/predictions?commodity=Rice` => { dates: [], values: [] }
    PREDICTIONS: '/predictions',
    // POST `${BACKEND_BASE_URL}/prices` => { status: 'ok' }
    SUBMIT_PRICE: '/prices',
    // Auth endpoints (optional on the backend)
    REGISTER: '/auth/register',
    SIGN_IN: '/auth/sign-in',
  },
};
