import path from 'path';
import fs from 'fs';
import { downloadSubtitles } from '../services/subtitles';
import { convertSrtToTxt, vttToSrt } from '../services/convertScript';
import { downloadAudio } from '../services/audio';

interface ApiResponse {
  videoData: {
    url: string;
    title:string
  };
}


export async function processing(data: ApiResponse) {
  const videoUrl = data.videoData.url;
  const videoTitle = data.videoData.title; 
  const subtitleLanguage = 'en'; 
  const outputDirectory = './subtitles';

  try {
    // Step 1: Try to download subtitles
    await downloadSubtitles(videoUrl, subtitleLanguage, outputDirectory);

    // Step 2: Find the actual VTT file in the output directory
    const subtitleFiles = await fs.promises.readdir(outputDirectory);
    const vttFile = subtitleFiles.find(file => file.endsWith('.vtt'));

    if (!vttFile) {
      throw new Error('No VTT file found after subtitle download.');
    }

    const vttFilePath = path.join(outputDirectory, vttFile);
    const srtFilePath = vttFilePath.replace('.vtt', '.srt');
    const txtFilePath = vttFilePath.replace('.vtt', '.txt');

    // Convert VTT to SRT and then to plain text
    await vttToSrt(vttFilePath, srtFilePath);
    await convertSrtToTxt(srtFilePath, txtFilePath);

    // Step 3: Call the function to make an API call to LLM
    const llmResponse = await sendToLLM(txtFilePath);

    // TODO: Save `llmResponse` to the database
    console.log('Processing done:', llmResponse);

    // Step 4: Clean up the subtitles directory after successful processing
    await cleanUpSubtitles(outputDirectory);

  } catch (subtitleError) {
    console.error('Failed to download or process subtitles:', subtitleError);

    try {
      // Step 5: If subtitle download fails, try downloading audio
      const audioOutput = await downloadAudio(videoUrl);

      // If audio is downloaded, send it to LLM
      const llmResponse = await sendToLLM(audioOutput);

      // TODO: Save `llmResponse` to the database
      console.log('Processing done with audio:', llmResponse);

      // Step 6: Clean up the subtitles directory after audio processing
      await cleanUpSubtitles(outputDirectory);

    } catch (audioError) {
      console.error('Failed to download audio:', audioError);
      throw new Error('Processing failed. Could not download subtitles or audio.');
    }
  }
}

// Helper function to clean up the subtitles directory
async function cleanUpSubtitles(directory: string) {
  try {
    // Remove all files inside the directory
    const files = await fs.promises.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      await fs.promises.unlink(filePath); // Delete the file
    }

    // Optionally, remove the directory itself
    await fs.promises.rmdir(directory);

    console.log('Subtitles directory cleaned up successfully.');
  } catch (error) {
    console.error('Failed to clean up subtitles directory:', error);
  }
}

// Helper function to clean up the video title for file names (if needed)
function sanitizeTitle(title: string): string {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Replace special characters with underscores
}



// Placeholder for LLM API call
async function sendToLLM(filePath: string): Promise<any> {
  // Assume we send the file to the LLM and get a response
  return { success: true, message: 'LLM processing completed.' };
}



