# Payment Setup (Demo)

This project includes a demo payment flow to let users select a plan and simulate checkout.

## What’s implemented
- Frontend `Payment` page (`frontend/src/pages/Payment.jsx`) with monthly/yearly options and a simple card/PayPal UI.
- Backend payment endpoints (`backend/src/routes/payment.js`) with a demo controller (`backend/src/controllers/paymentController.js`).
- Protected routing for `/payment` in `frontend/src/App.jsx`.

## Production integration (Stripe example)
1. Create a Stripe account and a project.
2. Get your API keys from the Stripe dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
3. Set environment variables in `backend/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   FRONTEND_ORIGIN=http://localhost:3000
   ```
4. Install Stripe SDK in backend:
   ```bash
   cd backend && npm i stripe
   ```
5. Replace demo logic in `backend/src/controllers/paymentController.js` with Stripe calls:
   - Create a Customer
   - Create a PaymentIntent or Subscription
   - Store subscription status and renewal dates in your DB
6. Update frontend to collect payment details using Stripe Elements or Checkout.

## Notes
- The demo does not charge cards or store card data. It simulates success and navigates to the dashboard.
- Ensure `/payment` is only accessible when authenticated. The route is wrapped with `ProtectedRoute`.