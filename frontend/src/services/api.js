const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4001/api';

export async function health() {
  const res = await fetch(`${API_BASE}/health`);
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function listDocuments() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/documents`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function uploadDocument(file) {
  const fd = new FormData();
  fd.append('file', file);
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: fd,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function getDocument(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function compareDocuments(docId1, docId2) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/documents/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ docId1, docId2 })
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function generateSummary(documentId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/documents/${documentId}/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}