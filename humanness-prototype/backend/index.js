import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Route Imports
import submissionRoutes from './routes/submissionRoutes.js';
import transcriptionRoutes from './routes/transcriptionRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';

dotenv.config();
console.log('Starting backend server...');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/submissions', submissionRoutes);
app.use('/api/transcriptions', transcriptionRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Humanness Backend API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/humanness';

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
