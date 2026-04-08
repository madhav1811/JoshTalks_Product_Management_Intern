import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  contributorId: { type: String, default: 'anonymous' },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);
