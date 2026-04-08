import express from 'express';
import { createSubmission, getAllSubmissions, getSubmissionById, updateSubmissionStatus } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/', createSubmission);
router.get('/', getAllSubmissions);
router.get('/:id', getSubmissionById);
router.patch('/:id/status', updateSubmissionStatus);

export default router;
