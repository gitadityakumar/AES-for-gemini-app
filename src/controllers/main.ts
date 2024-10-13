import path from 'path';
import fs from 'fs';
import { downloadSubtitles } from '../services/subtitles';
import { convertSrtToTxt, vttToSrt } from '../services/convertScript';
import { downloadAudio } from '../services/audio';
import { main } from '../llm/graq';
import { gemini } from '../llm/gemini';


interface ApiResponse {
  Data: {
    url: string;
    title: string;
  }[];
  usage: string;
  model: string | null;
}

export async function processing(
  data: ApiResponse,
  progress: (progress: number) => Promise<void>
) {
  const videoUrl = data.Data[0].url;   
  const videoTitle = data.Data[0].title; 
  const usage = data.usage; 
  const model = data.model; 
  
  // console.log(`Processing video: ${videoTitle} (${videoUrl}), Usage: ${usage}, Model: ${model}`);
  const subtitleLanguage = 'en'; 
  const outputDirectory = './subtitles';

  try {
    // Step 1: Try to download subtitles
    await downloadSubtitles(videoUrl, subtitleLanguage, outputDirectory);
    const subtitleFiles = await fs.promises.readdir(outputDirectory);
    const vttFile = subtitleFiles.find((file) => file.endsWith('.vtt'));
    await progress(60); 
    

    // Check if VTT file was found
    if (!vttFile) {
      throw new Error('No VTT file found after subtitle download.');
    }

    // Step 2: Convert VTT to SRT and TXT
    const vttFilePath = path.join(outputDirectory, vttFile);
    const srtFilePath = vttFilePath.replace('.vtt', '.srt');
    const txtFilePath = vttFilePath.replace('.vtt', '.txt');
    await vttToSrt(vttFilePath, srtFilePath);
    await progress(70); 
    await convertSrtToTxt(srtFilePath, txtFilePath);
    await progress(80); 

    // Step 3: Send TXT to LLM for processing
    const llmResponse = await sendToLLM(txtFilePath);
    await progress(90); 

    // Log and clean up
    console.log('Processing done:', llmResponse);
    await cleanUpSubtitles(outputDirectory);
    await progress(100); 
  } catch (subtitleError) {
    console.error('Failed to download or process subtitles:', subtitleError);

    try {
      // Step 4: Fallback to download and process audio if subtitles fail
      await progress(60); 
      const audioOutput = await downloadAudio(videoUrl);
      const llmResponse = await sendToLLM(audioOutput);
      await progress(90); // Progress after audio fallback and LLM processing

      console.log('Processing done with audio:', llmResponse);
      await cleanUpSubtitles(outputDirectory);
      await progress(100); // Final progress update
    } catch (audioError) {
      console.error('Failed to download audio:', audioError);
      throw new Error('Processing failed. Could not download subtitles or audio.');
    }
  }
}

// Helper function to clean up the subtitles directory
async function cleanUpSubtitles(directory: string) {
  try {
    if (fs.existsSync(directory)) {
      const files = await fs.promises.readdir(directory);
      for (const file of files) {
        const filePath = path.join(directory, file);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath); // Delete the file if it exists
        }
      }

      // Remove the directory itself (recursive option for future-proofing)
      await fs.promises.rm(directory, { recursive: true, force: true });
      console.log('Subtitles directory cleaned up successfully.');
    }
  } catch (error) {
    console.error('Failed to clean up subtitles directory:', error);
  }
}

// Placeholder for LLM API call
async function sendToLLM(filePath: string): Promise<any> {
  try {
    // Determine which LLM to use (e.g., based on some logic)
    const useGemini = true; // Add logic to switch between Gemini or Groq
    let response;

    if (useGemini) {
      response = await gemini(filePath);
    } else {
      response = await main(filePath); // Groq (Llama) logic
    }

    return response;
  } catch (error) {
    console.error('Error in LLM processing:', error);
    throw new Error('LLM processing failed.');
  }
}
