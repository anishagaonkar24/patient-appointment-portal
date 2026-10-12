// All backend calls live here. The backend runs on port 5000.
const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running on port 5000?');
  }

  const data = await res.json();

  if (!res.ok) {
    const details = data.errors ? data.errors.join(', ') : '';
    throw new Error(details ? `${data.message}: ${details}` : data.message || 'Request failed');
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
