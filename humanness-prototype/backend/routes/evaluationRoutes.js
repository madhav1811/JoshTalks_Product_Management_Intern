import express from 'express';
import { createEvaluation, getAllEvaluations } from '../controllers/evaluationController.js';

const router = express.Router();

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);

export default router;
