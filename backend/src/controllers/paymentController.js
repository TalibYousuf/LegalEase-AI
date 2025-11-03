// This is a payment controller with Razorpay integration
import crypto from 'crypto';

// Mock database for subscriptions
const subscriptions = {};

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET';

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { plan, amount } = req.body;
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!plan || !amount) {
      return res.status(400).json({ message: 'Plan and amount are required' });
    }
    
    // In a real implementation, you would:
    // 1. Initialize Razorpay client
    // 2. Create an order with Razorpay API
    
    // Simulating Razorpay order creation
    const orderId = `order_${Date.now()}`;
    
    // In production, you would use the Razorpay SDK:
    /*
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
    
    const order = await razorpay.orders.create({
      amount: amount, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto-capture
    });
    
    const orderId = order.id;
    */
    
    res.status(201).json({
      id: orderId,
      amount: amount,
      currency: 'INR',
      key: RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: Missing parameters' });
    }
    
    // In production, verify the signature
    /*
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
      
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
    }
    */
    
    // Create subscription record
    const subscription = {
      id: `sub_${Date.now()}`,
      userId,
      plan: req.body.plan || 'monthly', // Default to monthly if not specified
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (req.body.plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      paymentMethod: {
        type: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      }
    };
    
    // Store subscription in our mock database
    subscriptions[userId] = subscription;
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { plan, paymentMethod } = req.body;
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!plan || !paymentMethod) {
      return res.status(400).json({ message: 'Plan and payment method are required' });
    }
    
    // In a real implementation, you would:
    // 1. Create a customer in your payment processor
    // 2. Process the payment
    // 3. Store subscription details in your database
    
    const subscription = {
      id: `sub_${Date.now()}`,
      userId,
      plan,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      paymentMethod: {
        type: paymentMethod,
        last4: paymentMethod === 'card' ? req.body.cardNumber?.slice(-4) : null
      }
    };
    
    // Store subscription in our mock database
    subscriptions[userId] = subscription;
    
    res.status(201).json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt
      }
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ message: 'Failed to create subscription' });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const subscription = subscriptions[userId];
    
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        createdAt: subscription.createdAt,
        expiresAt: subscription.expiresAt
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Failed to retrieve subscription' });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const subscription = subscriptions[userId];
    
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    // Update subscription status
    subscription.status = 'cancelled';
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};