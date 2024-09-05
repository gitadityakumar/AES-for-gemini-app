import express from 'express';
import subtitlesController from '../controllers/subtitlesController'; // Import the controller

const router = express.Router();

// POST route to process video and return LLM response
router.post('/process-video', subtitlesController.processVideo);

// GET route for health check
router.get('/health-check', subtitlesController.healthCheck); // Pass the function reference, not calling it

export default router;
