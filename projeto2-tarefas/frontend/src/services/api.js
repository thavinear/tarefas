const DEFAULT_API_BASE = import.meta.env.PROD
  ? 'https://tarefas-backend-lgau.onrender.com'
  : 'http://localhost:8081';

const RAW_API_BASE = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE).trim();
const BASE_URL = `${RAW_API_BASE.replace(/\/+$/, '').replace(/\/api$/, '')}/api`;

async function request(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro na requisição (${res.status})`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return null;
}

export async function get(path) {
  return request(path, { method: 'GET' });
}

export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function del(path) {
  return request(path, { method: 'DELETE' });
}