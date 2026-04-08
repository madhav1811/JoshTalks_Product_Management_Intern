import express from 'express';
import { createTranscription, getAllTranscriptions, updateTranscriptionStatus } from '../controllers/transcriptionController.js';

const router = express.Router();

router.post('/', createTranscription);
router.get('/', getAllTranscriptions);
router.patch('/:id/status', updateTranscriptionStatus);

export default router;
