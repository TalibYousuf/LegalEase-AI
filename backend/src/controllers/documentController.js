import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { upsertDocument, getDocument, listDocuments } from '../store/db.js';
import Document from '../models/Document.js';
import { readDocumentText, summarizeText, extractClausesHeuristics } from '../utils/textProcessing.js';
import { extractClausesAI, compareClauseAI, summarizeClauseAI } from '../utils/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = process.env.UPLOADS_DIR
  ? (path.isAbsolute(process.env.UPLOADS_DIR) ? process.env.UPLOADS_DIR : path.resolve(__dirname, '../../../', process.env.UPLOADS_DIR))
  : path.resolve(__dirname, '../../../uploads');

export const list = (req, res) => {
  res.json(listDocuments());
};

export const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const id = crypto.randomUUID();
  const filePath = path.join(uploadsDir, req.file.filename);
  const text = await readDocumentText(filePath);
  const summary = summarizeText(text);

  const doc = new Document({
    id,
    filename: req.file.originalname,
    storedFilename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size,
    mimetype: req.file.mimetype,
    summary,
  });

  upsertDocument(doc);
  res.status(201).json(doc);
};

export const getById = (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  res.json(doc);
};

export const generateSummary = async (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  const absolutePath = path.join(uploadsDir, doc.storedFilename);
  const text = await readDocumentText(absolutePath);
  const summary = summarizeText(text);
  doc.summary = summary;
  upsertDocument(doc);
  res.json({ id: doc.id, summary });
};

export const clauses = async (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  const absolutePath = path.join(uploadsDir, doc.storedFilename);
  const text = await readDocumentText(absolutePath);

  const useAI = (req.body?.useAI ?? !!process.env.OPENAI_API_KEY) === true;
  let clauses = null;
  if (useAI) {
    clauses = await extractClausesAI(text);
  }
  if (!clauses) {
    // Fallback to heuristics and shape into objects
    const raw = extractClausesHeuristics(text);
    clauses = raw.map((c) => ({
      type: (c.split(':')[0] || 'Clause').trim(),
      text: c,
      riskLevel: 'medium',
      summary: ''
    }));
  }

  doc.clauses = clauses;
  upsertDocument(doc);
  res.json({ id: doc.id, clauses });
};

export const compareClause = async (req, res) => {
  const { clauseText = '', standardText = '' } = req.body || {};
  if (!clauseText || !standardText) {
    return res.status(400).json({ message: 'clauseText and standardText are required' });
  }
  const result = await compareClauseAI(clauseText, standardText);
  if (!result) {
    return res.json({ assessment: 'Comparison unavailable', differences: '', riskLevel: 'medium', suggestedRewrite: '' });
  }
  res.json(result);
};

export const summarizeClauses = async (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc || !Array.isArray(doc.clauses)) return res.status(404).json({ message: 'No clauses found for document' });
  const results = [];
  for (const c of doc.clauses) {
    const r = await summarizeClauseAI(c.text);
    results.push({ ...c, summary: r?.summary || c.summary || '' });
  }
  doc.clauses = results;
  upsertDocument(doc);
  res.json({ id: doc.id, clauses: results });
};

export const searchClauses = (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc || !Array.isArray(doc.clauses)) return res.status(404).json({ message: 'No clauses found for document' });
  const q = (req.query.q || '').toLowerCase();
  const matches = doc.clauses.filter((c) => c.text.toLowerCase().includes(q) || (c.type || '').toLowerCase().includes(q));
  res.json({ id: doc.id, query: q, matches });
};

function jaccard(a, b) {//calculates text similarity between the clauses,Measures how many unique words overlap between them 
  const setA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const setB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  const intersection = new Set([...setA].filter(x => setB.has(x))).size;
  const union = new Set([...setA, ...setB]).size;
  return union ? intersection / union : 0;
}

export const similarClauses = (req, res) => {
  const queryText = (req.query.text || '').trim();
  if (!queryText) return res.status(400).json({ message: 'text query is required' });
  const docs = listDocuments();
  const candidates = [];
  for (const d of docs) {
    const clauses = Array.isArray(d.clauses) ? d.clauses : [];
    for (const c of clauses) {
      candidates.push({ docId: d.id, clause: c, score: jaccard(queryText, c.text) });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  res.json({ query: queryText, results: candidates.slice(0, 10) });
};