import Transcription from '../models/Transcription.js';
import mongoose from 'mongoose';

let mockTranscriptions = [];
const isDBConnected = () => mongoose.connection.readyState === 1;

export const createTranscription = async (req, res) => {
  try {
    const { user_id, recording_url, whisper_text, user_text, is_edited, duration, time_taken_by_user } = req.body;
    const segment_character_per_second = user_text.replace(/\s/g, '').length / time_taken_by_user;
    
    if (isDBConnected()) {
      const newTranscription = new Transcription({ user_id, recording_url, whisper_text, user_text, is_edited, duration, time_taken_by_user, segment_character_per_second });
      await newTranscription.save();
      return res.status(201).json(newTranscription);
    } else {
      const newTranscription = {
        _id: Math.random().toString(36).substring(2, 9),
        user_id, recording_url, whisper_text, user_text, is_edited, duration, time_taken_by_user, segment_character_per_second,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };
      mockTranscriptions.unshift(newTranscription);
      return res.status(201).json(newTranscription);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating transcription', error: error.message });
  }
};

export const getAllTranscriptions = async (req, res) => {
  try {
    if (isDBConnected()) {
      const transcriptions = await Transcription.find().sort({ timestamp: -1 });
      res.status(200).json(transcriptions);
    } else {
      res.status(200).json(mockTranscriptions);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transcriptions', error: error.message });
  }
};

export const updateTranscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (isDBConnected()) {
      const transcription = await Transcription.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!transcription) return res.status(404).json({ message: 'Transcription not found' });
      res.status(200).json(transcription);
    } else {
      const index = mockTranscriptions.findIndex(t => t._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Transcription not found' });
      mockTranscriptions[index].status = status;
      res.status(200).json(mockTranscriptions[index]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating transcription', error: error.message });
  }
};
