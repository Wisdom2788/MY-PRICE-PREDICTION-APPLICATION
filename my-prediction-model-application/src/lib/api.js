// Simple API helpers to keep components clean and focused on UI concerns
// All functions return JSON or throw an Error with a user-friendly message

import { CONFIG } from '../config.js';

const withBase = (path) => `${CONFIG.BACKEND_BASE_URL}${path}`;

// Generic JSON fetch wrapper with timeout to keep UI responsive
async function fetchJson(url, options = {}, { timeoutMs = 8000 } = {}) {
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
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
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
