const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function health() {
  const res = await fetch(`${API_BASE}/health`);
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function listDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function uploadDocument(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/documents/upload`, { method: 'POST', body: fd });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function getDocument(id) {
  const res = await fetch(`${API_BASE}/documents/${id}`);
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function generateSummary(id) {
  const res = await fetch(`${API_BASE}/documents/${id}/summary`, { method: 'POST' });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function extractClauses(id, { useAI = false } = {}) {
  const res = await fetch(`${API_BASE}/documents/${id}/extract-clauses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ useAI })
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function summarizeAllClauses(id) {
  const res = await fetch(`${API_BASE}/documents/${id}/summarize-clauses`, { method: 'POST' });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function searchClauses(id, q) {
  const res = await fetch(`${API_BASE}/documents/${id}/search-clauses?q=${encodeURIComponent(q)}`);
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function compareClause(id, { clauseText, standardText }) {
  const res = await fetch(`${API_BASE}/documents/${id}/compare-clause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clauseText, standardText })
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function findSimilarClauses(text) {
  const res = await fetch(`${API_BASE}/documents/similar?text=${encodeURIComponent(text)}`);
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function analyzeRisks(id) {
  const res = await fetch(`${API_BASE}/documents/${id}/analyze-risks`, { method: 'POST' });
  return res.ok ? res.json() : Promise.reject(await res.json());
}

export async function compareDocuments(docId1, docId2) {
  const res = await fetch(`${API_BASE}/documents/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docId1, docId2 })
  });
  return res.ok ? res.json() : Promise.reject(await res.json());
}