import mongoose from 'mongoose';

const transcriptionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  recording_url: { type: String, required: true },
  whisper_text: { type: String, required: true },
  user_text: { type: String, required: true },
  is_edited: { type: Boolean, default: false },
  duration: { type: Number, required: true },
  time_taken_by_user: { type: Number, required: true },
  segment_character_per_second: { type: Number },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Transcription', transcriptionSchema);
