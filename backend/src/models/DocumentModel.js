import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  storedFilename: { type: String, required: true },
  size: { type: Number },
  mimetype: { type: String },
  path: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  summary: { type: String },
  aiSummary: { type: Object },
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);