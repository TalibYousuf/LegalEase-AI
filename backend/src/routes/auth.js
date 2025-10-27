import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { isMongoEnabled } from '../utils/db.js';
import User from '../models/User.js';

const router = express.Router();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Check if Google OAuth is configured
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const isGoogleOAuthConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET;

// Initiate Google OAuth (only if configured)
if (isGoogleOAuthConfigured) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // Handle Google OAuth callback
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_ORIGIN}/login?error=oauth_failed` }),
    async (req, res) => {
      const profile = req.user;
      let userId = null;
      if (isMongoEnabled) {
        try {
          const email = profile.emails?.[0]?.value || '';
          const googleId = profile.id;
          let user = await User.findOne({ $or: [{ googleId }, { email }] });
          if (!user) user = new User({ googleId, email });
          user.name = profile.displayName || user.name;
          user.picture = profile.photos?.[0]?.value || user.picture;
          user.provider = 'google';
          user.lastLogin = new Date();
          await user.save();
          userId = user._id.toString();
        } catch (e) {
          console.warn('User upsert failed:', e?.message || e);
        }
      }
      const payload = {
        sub: userId || profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || '',
        picture: profile.photos?.[0]?.value || '',
        provider: 'google'
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      const redirectUrl = `${FRONTEND_ORIGIN}/login/callback?token=${encodeURIComponent(token)}`;
      res.redirect(redirectUrl);
    }
  );
} else {
  // Fallback routes when Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      message: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' 
    });
  });

  router.get('/google/callback', (req, res) => {
    res.status(503).json({ 
      message: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' 
    });
  });
}

export default router;