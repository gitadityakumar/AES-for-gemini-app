import { Worker } from 'bullmq';
import { QueueOptions, Job } from 'bullmq';
import { processing } from '../controllers/main';
import { getVideoDuration, parseDuration } from '../utils/durationChecker';


const workerOptions: QueueOptions = {
  connection: {
    host: 'localhost',  
    port: 6379,         
  }
};

// Video processing worker
const videoWorker = new Worker('{video-processing}', async (job: Job) => {
  if (!job) {
    throw new Error('Job is undefined');
  }

  const data = job.data;
  const videoUrl = data.videoData.url;
  console.log(`Processing job ${job.id} for video: ${videoUrl}`);
  // const expectedDuration = parseDuration(data.videoData.duration);

  try {
    await job.updateProgress(10); // 10% progress: Validation phase
    const actualDuration = await getVideoDuration(videoUrl);
    const maxDurationInSeconds = 10000;

    if (actualDuration > maxDurationInSeconds) {
      console.error(`Validation failed for Job ${job.id}: Video exceeds maximum allowed duration of 10 minutes.`);
      await job.moveToFailed(new Error('Video exceeds maximum allowed duration of 10 minutes'), 'Video exceeds maximum allowed duration');
      return; // Exit early, do not proceed with processing
    }

   
    await job.updateProgress(50); 
    await processing(data);

    await job.updateProgress(100); // 100% progress: Processing complete

    console.log(`Job ${job.id} completed successfully!`);
  } catch (err) {
    //@ts-ignore
    console.error(`Error processing job ${job.id}:`, err.message);
    //@ts-ignore
    await job.moveToFailed(err, `Job failed during processing: ${err.message}`);
  }
}, workerOptions);

// Event handlers for completed and failed jobs
videoWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed successfully!`);
});

videoWorker.on('failed', (job: Job | undefined, err: Error) => {
  if (job) {
    console.log(`Job ${job.id} has failed with error: ${err.message}`);
  } else {
    console.log(`A job failed with error: ${err.message}`);
  }
});
