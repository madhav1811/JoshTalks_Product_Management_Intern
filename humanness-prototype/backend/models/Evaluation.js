import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  call_id: { type: String, required: true },
  evaluator_id: { type: String, required: true },
  intent_understanding: { type: Number, min: 1, max: 5, required: true },
  task_completion: { type: Number, min: 1, max: 5, required: true },
  naturalness: { type: Number, min: 1, max: 5, required: true },
  dialogue_flow: { type: Number, min: 1, max: 5, required: true },
  comments: { type: String },
  critical_failure: { type: Boolean, default: false },
  failure_type: { type: String, enum: ['HALLUCINATION', 'OFFENSIVE', 'DEAD_AIR', 'NONE'], default: 'NONE' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Evaluation', evaluationSchema);
