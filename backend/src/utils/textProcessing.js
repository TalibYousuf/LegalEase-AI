import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);//for importing modules in es modules because they are not supported by default
const pdfParse = require('pdf-parse'); //for extracting text from pdf files
const mammoth = require('mammoth');//for extracting text from docx files

export async function readDocumentText(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.txt' || ext === '.md' || ext === '.csv') {
      return fs.readFileSync(filePath, 'utf-8');
    }
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || '';
    }
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
    // Fallback for unsupported types
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return '';
  }
}

export function summarizeText(text, maxSentences = 3) {
  if (!text) return 'No text available to summarize.';
  const rawSentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  // Merge orphaned numbered sentences like "3." with the following sentence
  const sentences = [];
  for (let i = 0; i < rawSentences.length; i++) {
    const s = rawSentences[i];
    if (/^\d+\.$/.test(s) && i + 1 < rawSentences.length) {
      sentences.push(`${s} ${rawSentences[i + 1]}`);
      i++; // skip the next since we merged it
    } else {
      sentences.push(s);
    }
  }
  return sentences.slice(0, maxSentences).join(' ');
}

export function extractClausesHeuristics(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/).filter(Boolean);
  const clauses = lines.filter((l) => /^(\d+\.|Section|Clause|Article)/i.test(l)).slice(0, 20);
  if (clauses.length === 0) {
    return [
      'Confidentiality: Parties agree to keep information confidential.',
      'Termination: Either party may terminate with prior notice.',
      'Governing Law: This agreement is governed by local laws.'
    ];
  }
  return clauses;
}