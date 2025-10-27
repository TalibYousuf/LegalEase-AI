# Backend MongoDB Integration

This backend now supports MongoDB via Mongoose.

## Env Vars

Add to `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/legalease
JWT_SECRET=your-strong-secret
```

Google OAuth credentials (optional):
```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4001/api/auth/google/callback
```

## Models

- `User`: googleId, name, email, picture, provider, plan, role, lastLogin, timestamps
- `Document`: filename, storedFilename, size, mimetype, path, ownerId(ref User), summary, aiSummary, timestamps
- `Analysis`: documentId(ref Document), type, payload, timestamps

## Connection

`src/utils/db.js` automatically connects on server start if `MONGODB_URI` is set. If not set, the app runs without DB and logs a warning.

## OAuth Persistence

On Google OAuth callback, the backend will upsert a `User` record when MongoDB is enabled and include the user id in the issued JWT.

## Securing Endpoints

Primary document endpoints (`GET /api/documents`, `POST /api/documents/upload`, `GET /api/documents/:id`) are protected by JWT. Include the token in the `Authorization: Bearer <token>` header.

## Start

```
cd backend
npm install
PORT=4001 nodemon src/server.js
```