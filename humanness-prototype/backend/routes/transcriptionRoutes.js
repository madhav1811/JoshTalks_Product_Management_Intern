import express from 'express';
import { createTranscription, getAllTranscriptions, updateTranscriptionStatus, getTranscriberAnalytics } from '../controllers/transcriptionController.js';

const router = express.Router();

router.post('/', createTranscription);
router.get('/', getAllTranscriptions);
router.get('/analytics', getTranscriberAnalytics);
router.patch('/:id/status', updateTranscriptionStatus);

export default router;
