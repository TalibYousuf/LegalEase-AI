import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { list, upload, getById, generateSummary, clauses, compareClause, summarizeClauses, searchClauses, similarClauses, analyzeRisks, compareDocuments } from '../controllers/documentController.js';
import { requireAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Ensure uploads dir
const uploadsDir = process.env.UPLOADS_DIR
  ? path.isAbsolute(process.env.UPLOADS_DIR)
    ? process.env.UPLOADS_DIR
    : path.resolve(__dirname, '../../../', process.env.UPLOADS_DIR)
  : path.resolve(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const uploadMiddleware = multer({ storage });

// List documents
router.get('/', requireAuth, list);
// Upload document
router.post('/upload', requireAuth, uploadMiddleware.single('file'), upload);
// Ensure specific routes precede dynamic :id matches
router.get('/similar', similarClauses);

// Get document by ID
router.get('/:id', requireAuth, getById);

// Generate summary
router.post('/:id/summary', requireAuth, generateSummary);

// Extract clauses (AI + fallback)
router.post('/:id/extract-clauses', requireAuth, clauses);

// Compare clause against a standard
router.post('/:id/compare-clause', requireAuth, compareClause);

// Summarize all clauses for a document
router.post('/:id/summarize-clauses', requireAuth, summarizeClauses);

// Search clauses in a document
router.get('/:id/search-clauses', requireAuth, searchClauses);

// Find similar clauses across documents
router.get('/similar', similarClauses);

// Risk analysis for a document
router.post('/:id/analyze-risks', requireAuth, analyzeRisks);

// Compare two documents
router.post('/compare', requireAuth, compareDocuments);

export default router;