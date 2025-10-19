import express from 'express';
import cors from 'cors';
import morgan from 'morgan';//for logging http requests
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Serve uploaded files statically
const uploadsDir = process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check
import { health as healthController } from './controllers/healthController.js';
app.get('/api/health', healthController);

// Routes
import documentsRouter from './routes/documents.js';
app.use('/api/documents', documentsRouter);
// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});