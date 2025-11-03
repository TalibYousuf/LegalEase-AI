import { Router } from 'express';
import { createSubscription, getSubscription, cancelSubscription, createOrder, verifyPayment } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Razorpay endpoints
router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);

// Create a new subscription
router.post('/subscribe', requireAuth, createSubscription);

// Get user's subscription details
router.get('/subscription', requireAuth, getSubscription);

// Cancel subscription
router.post('/cancel', requireAuth, cancelSubscription);

export default router;