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

export const getTranscriberAnalytics = async (req, res) => {
  try {
    let data = [];
    if (isDBConnected()) {
      data = await Transcription.find();
    } else {
      data = mockTranscriptions;
    }

    // Group by user_id
    const userGroups = data.reduce((acc, curr) => {
      if (!acc[curr.user_id]) {
        acc[curr.user_id] = {
          user_id: curr.user_id,
          total_tasks: 0,
          edited_count: 0,
          total_duration: 0,
          total_time_taken: 0,
          total_cps: 0,
          tasks: []
        };
      }
      const group = acc[curr.user_id];
      group.total_tasks += 1;
      if (curr.is_edited) group.edited_count += 1;
      group.total_duration += curr.duration;
      group.total_time_taken += curr.time_taken_by_user;
      group.total_cps += curr.segment_character_per_second || 0;
      group.tasks.push(curr);
      return acc;
    }, {});

    const analytics = Object.values(userGroups).map(u => {
      const edit_rate = (u.edited_count / u.total_tasks) * 100;
      const time_ratio = u.total_time_taken / u.total_duration;
      const avg_cps = u.total_cps / u.total_tasks;
      
      let flags = [];
      if (edit_rate < 15) flags.push('Low Edit Rate');
      if (time_ratio < 0.7) flags.push('Rushing');
      if (avg_cps > 15) flags.push('High CPS');

      return {
        user_id: u.user_id,
        total_tasks: u.total_tasks,
        edit_rate: edit_rate.toFixed(2),
        time_ratio: time_ratio.toFixed(2),
        avg_cps: avg_cps.toFixed(2),
        flags,
        status: flags.length > 0 ? 'FLAGGED' : 'HEALTHY'
      };
    });

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
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
