import Evaluation from '../models/Evaluation.js';
import mongoose from 'mongoose';

// In-memory fallback for demonstration if MongoDB is not connected
let mockEvaluations = [
  {
    _id: 'eval1',
    call_id: 'CALL-1024',
    evaluator_id: 'EVAL-01',
    intent_understanding: 5,
    task_completion: 4,
    naturalness: 4,
    dialogue_flow: 5,
    comments: 'The AI handled the hotel booking query perfectly, understood the date change correctly.',
    critical_failure: false,
    timestamp: new Date().toISOString()
  },
  {
    _id: 'eval2',
    call_id: 'CALL-1025',
    evaluator_id: 'EVAL-02',
    intent_understanding: 2,
    task_completion: 1,
    naturalness: 3,
    dialogue_flow: 2,
    comments: 'AI failed to understand the user\'s accent and kept repeating the same question.',
    critical_failure: true,
    failure_type: 'DEAD_AIR',
    timestamp: new Date().toISOString()
  }
];

const isDBConnected = () => mongoose.connection.readyState === 1;

// Create a new evaluation
export const createEvaluation = async (req, res) => {
  try {
    const { 
      call_id, 
      evaluator_id, 
      intent_understanding, 
      task_completion, 
      naturalness, 
      dialogue_flow, 
      comments, 
      critical_failure, 
      failure_type 
    } = req.body;
    
    if (isDBConnected()) {
      const newEvaluation = new Evaluation({
        call_id,
        evaluator_id,
        intent_understanding,
        task_completion,
        naturalness,
        dialogue_flow,
        comments,
        critical_failure,
        failure_type
      });
      await newEvaluation.save();
      return res.status(201).json(newEvaluation);
    } else {
      const newEvaluation = {
        _id: Math.random().toString(36).substring(2, 9),
        call_id, 
        evaluator_id, 
        intent_understanding, 
        task_completion, 
        naturalness, 
        dialogue_flow, 
        comments, 
        critical_failure, 
        failure_type,
        timestamp: new Date().toISOString()
      };
      mockEvaluations.unshift(newEvaluation);
      return res.status(201).json(newEvaluation);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating evaluation', error: error.message });
  }
};

// Get all evaluations (for Admin)
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
