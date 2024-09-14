import path from 'path';
import fs from 'fs';
import { downloadSubtitles } from '../services/subtitles';
import { convertSrtToTxt, vttToSrt } from '../services/convertScript';
import { downloadAudio } from '../services/audio';
import { main } from '../llm/graq';
import { gemini } from '../llm/gemini';

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
    await downloadSubtitles(videoUrl, subtitleLanguage, outputDirectory);
    const subtitleFiles = await fs.promises.readdir(outputDirectory);
    const vttFile = subtitleFiles.find(file => file.endsWith('.vtt'));

    if (!vttFile) {
      throw new Error('No VTT file found after subtitle download.');
    }

    const vttFilePath = path.join(outputDirectory, vttFile);
    const srtFilePath = vttFilePath.replace('.vtt', '.srt');
    const txtFilePath = vttFilePath.replace('.vtt', '.txt');
    await vttToSrt(vttFilePath, srtFilePath);
    await convertSrtToTxt(srtFilePath, txtFilePath);

    const llmResponse = await sendToLLM(txtFilePath);

    //  Save `llmResponse` to the database
    console.log('Processing done:', llmResponse);
    await cleanUpSubtitles(outputDirectory);
  } catch (subtitleError) {
    console.error('Failed to download or process subtitles:', subtitleError);

    try {
      const audioOutput = await downloadAudio(videoUrl);
      const llmResponse = await sendToLLM(audioOutput);

      console.log('Processing done with audio:', llmResponse);
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


// Placeholder for LLM API call
async function sendToLLM(filePath: string): Promise<any> {
  // return { success: true, message: 'LLM processing completed.' };
  const res = await gemini(filePath);
  console.log(res);
}



