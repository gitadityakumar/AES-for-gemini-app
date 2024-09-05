const ytdlp = require('yt-dlp-exec');

//@ts-ignore
async function downloadAudio(videoUri, p0: string, p1: string) {
  try {
    const output = 'audio.mp3'; // Change to desired path and filename
    await ytdlp(videoUri, {
      output: output,
      extractAudio: true,
      audioFormat: 'wav', // Choose the audio format: mp3, wav, m4a, etc.
    });
    console.log(`Audio downloaded to ${output}`);
    return output;
  } catch (error) {
    //@ts-ignore
    console.error(`Error downloading audio: ${error.message}`);
    throw error;
  }
}

// Example usage
// const videoUri = 'https://www.youtube.com/watch?v=e5dhaQm_J6U';
// downloadAudio(videoUri).then((output) => {
//   console.log(`Audio downloaded successfully: ${output}`);
// }).catch((error) => {
//   console.error(`Failed to download audio: ${error}`);
// });
