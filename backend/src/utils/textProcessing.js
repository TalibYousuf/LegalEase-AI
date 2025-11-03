import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);//for importing modules in es modules because they are not supported by default
const pdfParse = require('pdf-parse'); //for extracting text from pdf files
const mammoth = require('mammoth');//for extracting text from docx files

export async function readDocumentText(filePath) {
  try {
    console.log(`Reading document from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return '';
    }
    
    const ext = path.extname(filePath).toLowerCase();
    let text = '';
    
    if (ext === '.txt' || ext === '.md' || ext === '.csv') {
      text = fs.readFileSync(filePath, 'utf-8');
    }
    else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      try {
        const options = {
          // Add options to improve text extraction
          pagerender: function(pageData) {
            return pageData.getTextContent({normalizeWhitespace: true})
              .then(function(textContent) {
                let lastY, text = '';
                for (let item of textContent.items) {
                  if (lastY == item.transform[5] || !lastY)
                    text += item.str;
                  else
                    text += '\n' + item.str;
                  lastY = item.transform[5];
                }
                return text;
              });
          }
        };
        
        const data = await pdfParse(dataBuffer, options);
        text = data.text || '';
        
        // Special handling for CamScanner and similar apps
        if (text.length === 0 || (text.includes("CamScanner") && text.trim().split(/\s+/).length < 10)) {
          console.log("Detected possible CamScanner document with extraction issues, trying alternative method");
          // Try alternative extraction without custom renderer
          const basicData = await pdfParse(dataBuffer);
          text = basicData.text || text;
        }
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError.message);
        // Try basic extraction as fallback
        try {
          const basicData = await pdfParse(dataBuffer, { max: 5 }); // Try with limited pages
          text = basicData.text || '';
        } catch (e) {
          console.error("Fallback PDF parsing also failed");
        }
      }
    }
    else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value || '';
    }
    else {
      // Fallback for unsupported types
      try {
        text = fs.readFileSync(filePath, 'utf-8');
      } catch (readErr) {
        console.error(`Failed to read unsupported file type: ${ext}`, readErr);
      }
    }
    
    console.log(`Extracted ${text.length} characters from document`);
    if (text.length < 50) {
      console.warn(`Warning: Extracted text is very short (${text.length} chars)`);
    }
    
    return text;
  } catch (e) {
    console.error(`Error extracting text from document: ${e.message}`, e);
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