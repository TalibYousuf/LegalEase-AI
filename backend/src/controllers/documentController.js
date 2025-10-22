import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { upsertDocument, getDocument, listDocuments } from '../store/db.js';
import Document from '../models/Document.js';
import { readDocumentText, summarizeText, extractClausesHeuristics } from '../utils/textProcessing.js';
import { extractClausesAI, compareClauseAI, summarizeClauseAI, generateDocumentSummaryAI, getOpenAIClient, getModel } from '../utils/ai.js';

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
  
  // Try AI summary first, fallback to basic summarization
  let summary = null;
  try {
    const aiSummary = await generateDocumentSummaryAI(text);
    if (aiSummary) {
      summary = aiSummary;
    }
  } catch (err) {
    console.warn('AI summary failed, using fallback:', err?.message);
  }
  
  // Fallback to basic summarization if AI fails
  if (!summary) {
    summary = {
      executiveSummary: summarizeText(text, 5),
      keyTerms: [],
      obligations: [],
      risks: [],
      recommendations: ['Review this document with legal counsel for complete analysis.']
    };
  }
  
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

// New function for risk analysis
export const analyzeRisks = async (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  
  const absolutePath = path.join(uploadsDir, doc.storedFilename);
  const text = await readDocumentText(absolutePath);
  
  // Analyze risks using AI
  const client = getOpenAIClient();
  if (!client) {
    return res.status(503).json({ message: 'AI service unavailable' });
  }
  
  const model = getModel();
  const system = `You are a legal risk assessment AI. Analyze legal documents for potential risks and red flags.

Return a JSON object with:
- overallRiskLevel: "low", "medium", or "high"
- riskScore: A number 0-100 indicating overall risk
- redFlags: Array of concerning clauses or terms
- missingClauses: Important clauses that appear to be missing
- recommendations: Specific actions to mitigate risks
- riskBreakdown: Detailed analysis by category (financial, legal, operational, etc.)`;

  const user = `Analyze this legal document for potential risks and red flags:

${text.substring(0, 10000)}`;

  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });
    
    const content = resp.choices?.[0]?.message?.content || '{}';
    const riskAnalysis = JSON.parse(content);
    
    doc.riskAnalysis = riskAnalysis;
    upsertDocument(doc);
    
    res.json({ id: doc.id, riskAnalysis });
  } catch (err) {
    console.warn('Risk analysis error:', err?.message || err);
    res.status(500).json({ message: 'Failed to analyze risks' });
  }
};

// Enhanced document comparison
export const compareDocuments = async (req, res) => {
  const { docId1, docId2 } = req.body;
  if (!docId1 || !docId2) {
    return res.status(400).json({ message: 'Both docId1 and docId2 are required' });
  }
  
  const doc1 = getDocument(docId1);
  const doc2 = getDocument(docId2);
  
  if (!doc1 || !doc2) {
    return res.status(404).json({ message: 'One or both documents not found' });
  }
  
  const path1 = path.join(uploadsDir, doc1.storedFilename);
  const path2 = path.join(uploadsDir, doc2.storedFilename);
  
  const text1 = await readDocumentText(path1);
  const text2 = await readDocumentText(path2);
  
  // Use AI for document comparison
  const client = getOpenAIClient();
  if (!client) {
    return res.status(503).json({ message: 'AI service unavailable' });
  }
  
  const model = getModel();
  const system = `You are a legal AI that compares two legal documents and identifies key differences.

Return a JSON object with:
- summary: Overall comparison summary
- keyDifferences: Array of major differences found
- similarClauses: Clauses that are similar between documents
- uniqueToDoc1: Clauses only in the first document
- uniqueToDoc2: Clauses only in the second document
- riskAssessment: Which document has higher risk and why
- recommendations: Suggestions for which document to use or how to merge them`;

  const user = `Compare these two legal documents:

DOCUMENT 1 (${doc1.filename}):
${text1.substring(0, 6000)}

DOCUMENT 2 (${doc2.filename}):
${text2.substring(0, 6000)}`;

  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });
    
    const content = resp.choices?.[0]?.message?.content || '{}';
    const comparison = JSON.parse(content);
    
    res.json({ 
      doc1: { id: doc1.id, filename: doc1.filename },
      doc2: { id: doc2.id, filename: doc2.filename },
      comparison 
    });
  } catch (err) {
    console.warn('Document comparison error:', err?.message || err);
    res.status(500).json({ message: 'Failed to compare documents' });
  }
};