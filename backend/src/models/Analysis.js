import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  type: { type: String, enum: ['summary', 'clauses', 'risk', 'compare'], required: true },
  payload: { type: Object },
}, { timestamps: true });

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);