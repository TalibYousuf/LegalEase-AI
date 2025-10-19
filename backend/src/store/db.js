import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../backend/data');
const dataFile = path.join(dataDir, 'documents.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ documents: {} }, null, 2));
}

export function load() {
  ensureStore();
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw);
}

export function save(store) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
}

export function upsertDocument(doc) {
  const store = load();
  store.documents[doc.id] = doc;
  save(store);
  return doc;
}

export function getDocument(id) {
  const store = load();
  return store.documents[id] || null;
}

export function listDocuments() {
  const store = load();
  return Object.values(store.documents);
}