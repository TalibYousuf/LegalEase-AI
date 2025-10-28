import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';//for logging http requests
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connectMongo } from './utils/db.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv is already loaded via import 'dotenv/config'
connectMongo();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Configure Passport Google OAuth strategy if env vars are present
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/api/auth/google/callback`;
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }));
}

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Serve uploaded files statically
const uploadsDir = process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check
import { health as healthController } from './controllers/healthController.js';
app.get('/api/health', healthController);

// Routes
import documentsRouter from './routes/documents.js';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
app.use('/api/documents', documentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});