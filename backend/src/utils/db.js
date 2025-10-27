import mongoose from 'mongoose';

let isConnected = false;
export let isMongoEnabled = false;

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MongoDB not configured: set MONGODB_URI in .env');
    isMongoEnabled = false;
    return;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    isMongoEnabled = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err?.message || err);
    isConnected = false;
    isMongoEnabled = false;
  }
}

export function getMongoConnectionState() {
  return { isConnected, isMongoEnabled };
}