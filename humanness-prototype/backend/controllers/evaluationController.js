import Evaluation from '../models/Evaluation.js';
import mongoose from 'mongoose';

let mockEvaluations = [];
const isDBConnected = () => mongoose.connection.readyState === 1;

export const createEvaluation = async (req, res) => {
  try {
    const { call_id, evaluator_id, intent_understanding, task_completion, naturalness, dialogue_flow, comments, critical_failure, failure_type } = req.body;
    
    if (isDBConnected()) {
      const newEvaluation = new Evaluation({ call_id, evaluator_id, intent_understanding, task_completion, naturalness, dialogue_flow, comments, critical_failure, failure_type });
      await newEvaluation.save();
      return res.status(201).json(newEvaluation);
    } else {
      const newEvaluation = {
        _id: Math.random().toString(36).substring(2, 9),
        call_id, evaluator_id, intent_understanding, task_completion, naturalness, dialogue_flow, comments, critical_failure, failure_type,
        timestamp: new Date().toISOString()
      };
      mockEvaluations.unshift(newEvaluation);
      return res.status(201).json(newEvaluation);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating evaluation', error: error.message });
  }
};

export const getAllEvaluations = async (req, res) => {
  try {
    if (isDBConnected()) {
      const evaluations = await Evaluation.find().sort({ timestamp: -1 });
      res.status(200).json(evaluations);
    } else {
      res.status(200).json(mockEvaluations);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching evaluations', error: error.message });
  }
};
