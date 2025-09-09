// Simple API helpers to keep components clean and focused on UI concerns
// All functions return JSON or throw an Error with a user-friendly message

import { CONFIG } from '../config.js';

const withBase = (path) => `${CONFIG.BACKEND_BASE_URL}${path}`;

// Small helper to detect placeholder backend and serve mocked responses
function isUsingPlaceholderBackend() {
  const placeholder = 'https://your-backend.example.com';
  const base = (CONFIG.BACKEND_BASE_URL || '').trim();
  return !base || base === placeholder || base.includes('your-backend');
}

// Lightweight mock data generator for offline / placeholder mode
function mockResponseFor(url, options = {}) {
  const u = new URL(url);
  // predictions: /predictions?commodity=Rice
  if (u.pathname.endsWith('/predictions')) {
    const commodity = u.searchParams.get('commodity') || 'Rice';
    const today = new Date();
    const dates = Array.from({ length: 10 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    // Simple deterministic base prices by commodity to keep mock realistic
    const basePrice = ({ Rice: 15000, Petrol: 200, Sugar: 450 }[commodity] || 1000);
    const values = dates.map((_, i) => Math.round((basePrice + Math.sin(i / 2) * (basePrice * 0.03) + i * (basePrice * 0.005)) * 100) / 100);
    return Promise.resolve({ dates, values });
  }

  // submit price: return success
  if (u.pathname.endsWith('/prices')) {
    return Promise.resolve({ status: 'ok' });
  }

  // auth endpoints: simple success for register/sign-in
  if (u.pathname.endsWith('/auth/register') || u.pathname.endsWith('/auth/sign-in')) {
    return Promise.resolve({ status: 'ok' });
  }

  // default mock: empty object
  return Promise.resolve({});
}

// Generic JSON fetch wrapper with timeout to keep UI responsive and provide helpful errors
async function fetchJson(url, options = {}, { timeoutMs = 8000 } = {}) {
  // If backend is not configured, return mocked responses to keep the UI functional
  if (isUsingPlaceholderBackend()) {
    // Small artificial delay to simulate network latency
    await new Promise((res) => setTimeout(res, 300));
    return mockResponseFor(url, options);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
      ...options,
    });
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json() : null;
    if (!res.ok) {
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    // Handle AbortError (timeout) with a user-friendly message
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    // Network errors (e.g., CORS, DNS, connection refused) appear as TypeError: Failed to fetch
    if (err instanceof TypeError) {
      throw new Error('Network error: failed to reach backend. Check BACKEND_BASE_URL and CORS settings.');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchPredictions(commodity) {
  const url = withBase(`${CONFIG.ENDPOINTS.PREDICTIONS}?commodity=${encodeURIComponent(commodity)}`);
  return fetchJson(url, { method: 'GET' });
}

export async function submitPrice({ commodity, price }) {
  const url = withBase(CONFIG.ENDPOINTS.SUBMIT_PRICE);
  return fetchJson(url, { method: 'POST', body: JSON.stringify({ commodity, price }) });
}

export async function registerUser({ firstName, lastName, email, password }) {
  const url = withBase(CONFIG.ENDPOINTS.REGISTER);
  return fetchJson(url, { method: 'POST', body: JSON.stringify({ firstName, lastName, email, password }) });
}

export async function signInUser({ email, password }) {
  const url = withBase(CONFIG.ENDPOINTS.SIGN_IN);
  return fetchJson(url, { method: 'POST', body: JSON.stringify({ email, password }) });
}
