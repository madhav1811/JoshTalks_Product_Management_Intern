import Submission from '../models/Submission.js';
import mongoose from 'mongoose';

// In-memory fallback for demonstration if MongoDB is not connected
let mockSubmissions = [
  {
    _id: 'mock1',
    village: 'Rohtak Village 1',
    district: 'Rohtak',
    state: 'Haryana',
    description: 'A traditional handpump used for drinking water in rural Rohtak.',
    imageUrl: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=400',
    timestamp: new Date().toISOString(),
    status: 'APPROVED',
  },
  {
    _id: 'mock2',
    village: 'Sonipat Village A',
    district: 'Sonipat',
    state: 'Haryana',
    description: 'Entrance to a local Durga Puja pandal during the festival.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=400',
    timestamp: new Date().toISOString(),
    status: 'PENDING',
  }
];

const isDBConnected = () => mongoose.connection.readyState === 1;

// Create a new submission
export const createSubmission = async (req, res) => {
  try {
    const { village, district, state, description, imageUrl, location } = req.body;
    
    if (isDBConnected()) {
      const newSubmission = new Submission({ village, district, state, description, imageUrl, location });
      await newSubmission.save();
      return res.status(201).json(newSubmission);
    } else {
      const newSubmission = {
        _id: Math.random().toString(36).substring(2, 9),
        village, district, state, description, imageUrl, location,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };
      mockSubmissions.unshift(newSubmission);
      return res.status(201).json(newSubmission);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
};

// Get all submissions (for Admin)
export const getAllSubmissions = async (req, res) => {
  try {
    if (isDBConnected()) {
      const submissions = await Submission.find().sort({ timestamp: -1 });
      res.status(200).json(submissions);
    } else {
      res.status(200).json(mockSubmissions);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Get single submission
export const getSubmissionById = async (req, res) => {
  try {
    if (isDBConnected()) {
      const submission = await Submission.findById(req.params.id);
      if (!submission) return res.status(404).json({ message: 'Submission not found' });
      res.status(200).json(submission);
    } else {
      const submission = mockSubmissions.find(s => s._id === req.params.id);
      if (!submission) return res.status(404).json({ message: 'Submission not found' });
      res.status(200).json(submission);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
};

// Update submission status (Approve/Reject)
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (isDBConnected()) {
      const submission = await Submission.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!submission) return res.status(404).json({ message: 'Submission not found' });
      res.status(200).json(submission);
    } else {
      const index = mockSubmissions.findIndex(s => s._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Submission not found' });
      mockSubmissions[index].status = status;
      res.status(200).json(mockSubmissions[index]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating submission', error: error.message });
  }
};
