import { downloadSubtitles, downloadAudio} from "./audioSubtitlesService";
// import * as fs from 'fs';
// import * as path from 'path'

// (async () => {
  const videoUrl = 'https://www.youtube.com/watch?v=e5dhaQm_J6U'; // Example URL
  const subtitlesDir = './subtitles';
//   const audioDir = './audio';

//   try {
//     // Check if subtitles already exist in the subtitles directory
//     const subtitleFiles = await fs.promises.readdir(subtitlesDir);
//     const existingSubtitles = subtitleFiles.find(file => file.endsWith('.vtt') || file.endsWith('.srt'));

//     let subtitlePath: string | null = null;
//     if (existingSubtitles) {
//       subtitlePath = path.join(subtitlesDir, existingSubtitles);
//       console.log(`Subtitles already exist: ${subtitlePath}`);
//     } else {
//       // If no subtitle file found, download the subtitles
//       subtitlePath = await downloadSubtitles(videoUrl, 'en', subtitlesDir);
//       if (subtitlePath) {
//         console.log(`Subtitles downloaded: ${subtitlePath}`);
//       }
//     }

//     // Only download audio if subtitles are successfully downloaded
//     // if (subtitlePath) {
//     //   const audioPath = await downloadAudio(videoUrl, audioDir, 'mp3');
//     //   if (audioPath) {
//     //     console.log(`Audio downloaded: ${audioPath}`);
//     //   } else {
//     //     console.log('Failed to download audio.');
//     //   }
//     // } else {
//     //   console.log('Subtitles not found or failed to download, skipping audio download.');
//     // }
//   } catch (error) {
//     //@ts-ignore
//     console.error(`An error occurred: ${error.message || error}`);
//   }
// })();
downloadSubtitles(videoUrl);