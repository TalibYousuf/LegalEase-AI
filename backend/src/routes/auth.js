import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_ORIGIN}/login?error=oauth_failed` }),
  (req, res) => {
    const profile = req.user;
    const payload = {
      sub: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value || '',
      picture: profile.photos?.[0]?.value || '',
      provider: 'google'
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    // Redirect back to the frontend with token as a query param
    const redirectUrl = `${FRONTEND_ORIGIN}/login/callback?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

export default router;