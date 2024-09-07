import {Worker} from 'bullmq';

const worker = new Worker('processing-queue', async (job) => {
    const { videoUrl, model } = job.data;
    // Perform video processing (download subtitles or audio, call LLM)
}, {
    connection: { host: '127.0.0.1', port: 6379 }
});