import { Worker } from 'bullmq';
import { QueueOptions, Job } from 'bullmq';

// Dragonfly connection options
const workerOptions: QueueOptions = {
  connection: {
    host: 'localhost',  // Dragonfly is running locally
    port: 6379,         // Default Dragonfly port
  }
};

// Video processing worker
const videoWorker = new Worker('{video-processing}', async (job: Job) => {
  if (!job) {
    throw new Error('Job is undefined');
  }

  //real processing 
  const data = job.data;
  // console.log('data from apiserver:',data);
  const videoUrl = data.videoData.url;
  

  

  // Simulate video processing
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate some async work

  console.log('Job completed:', job.id);
}, workerOptions);

// Event handlers for completed and failed jobs
videoWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed!`);
});

videoWorker.on('failed', (job: Job | undefined, err: Error) => {
  if (job) {
    console.log(`Job ${job.id} has failed with error: ${err.message}`);
  } else {
    console.log(`A job failed with error: ${err.message}`);
  }
});
