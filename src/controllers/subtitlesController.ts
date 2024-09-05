// src/controllers/subtitlesController.ts

import { Request, Response } from 'express';

// Dummy method for processing video and returning LLM response
const processVideo = async (req: Request, res: Response) => {
    try {
        const { videoUrl } = req.body;
        if (!videoUrl) {
            return res.status(400).send('Video URL is required.');
        }
        
        // Dummy LLM response (replace with actual LLM processing later)
        const dummyLlmResponse = `Processed video at URL: ${videoUrl}`;
        
        // Simulate some delay (to mock async processing)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Send back the dummy response
        return res.status(200).send(dummyLlmResponse);
    } catch (error) {
        return res.status(500).send('Error processing the video.');
    }
};

// Dummy health-check method
const healthCheck = (req: Request, res: Response) => {
    return res.status(200).send('OK');
};

export default {
    processVideo,
    healthCheck
};
