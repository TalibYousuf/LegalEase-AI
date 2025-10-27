import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true },
  name: { type: String },
  email: { type: String, index: true, unique: true, sparse: true },
  picture: { type: String },
  provider: { type: String, default: 'google' },
  plan: { type: String, default: 'Free' },
  role: { type: String, default: 'user' },
  lastLogin: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);