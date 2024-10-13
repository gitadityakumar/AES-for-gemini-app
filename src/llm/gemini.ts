// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleAIFileManager } from "@google/generative-ai/server";
// import * as dotenv from "dotenv";
// import fs from "fs/promises";
// import path from 'path';
// dotenv.config();

// const apikey= process.env.GEMINI_API_KEY || " ";
// if(!apikey) throw new Error("Missing GEMINI_API_KEY");
// const genAI = new GoogleGenerativeAI(apikey);

// // text genration function
// //@ts-ignore
// export async function gemini(txtFilePath){
//   try{
//     const subtitlesContent = await fs.readFile(txtFilePath, 'utf-8');
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
//  {
//    "words": [
//      {
//        "word": "example",
//        "meaning": "a representative instance of a particular category"
//      },
//      {
//        "word": "technology",
//        "meaning": "the application of scientific knowledge for practical purposes"
//      },
//      {
//        "word": "company",
//        "meaning": "a commercial business or enterprise"
//      },
//      {
//        "word": "predatory",
//        "meaning": "seeking to exploit or oppress others, often in a ruthless or aggressive manner"
//      }
//    ]
//  }
//  do not give me anyting except having a json object containing all words and their meaning. 
//  `, 
//      });
//     const prompt = `${subtitlesContent}`;
//     const result = await model.generateContent(prompt);
//     // const totalToken = result.response.usageMetadata?.totalTokenCount;
//     const output = result.response.text();
//     return output;
//   }catch(error){
//     console.error("Error during processing:", error);
//   }
  
// };


// //audio to text gen function
// export async function audioGemini() {
//   try {
//     const fileManager = new GoogleAIFileManager(apikey);

//     // Upload audio
//     const filePath = path.resolve(__dirname, "../../subtitles/audio.mp3");
//     const audioFile = await fileManager.uploadFile(filePath, {
//       mimeType: "audio/mp3",
//     });

//     // Assuming 'audioFile' contains file metadata
//     const uploadedFile = audioFile.file; // Adjust this based on the actual response structure
//     if (!uploadedFile || !uploadedFile.uri || !uploadedFile.mimeType) {
//       throw new Error("Uploaded file does not contain necessary metadata.");
//     }

//     const genAI = new GoogleGenerativeAI(apikey);
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//     });

//     // Generate content
//     const result = await model.generateContent([
//       {
//         fileData: {
//           mimeType: uploadedFile.mimeType,
//           fileUri: uploadedFile.uri,
//         },
//       },
//       { text: `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
// {
//   "words": [
//     {
//       "word": "example",
//       "meaning": "a representative instance of a particular category"
//     },
//     {
//       "word": "technology",
//       "meaning": "the application of scientific knowledge for practical purposes"
//     },
//     {
//       "word": "company",
//       "meaning": "a commercial business or enterprise"
//     },
//     {
//       "word": "predatory",
//       "meaning": "seeking to exploit or oppress others, often in a ruthless or aggressive manner"
//     }
//   ]
// }
// do not give me anyting except having a json object containing all words and their meaning. ` },
//     ]);
    
//     console.log( result.response.text());

//     // List files
//     const listFilesResponse = await fileManager.listFiles();

//     if (listFilesResponse.files) {
//       for (const file of listFilesResponse.files) {
//         const name = file.name || "Unnamed file";
//         const displayName = file.displayName || "No display name";
//         console.log(`name: ${name} | display name: ${displayName}`);
//       }
//     }

//     // Delete the uploaded file if it has a 'name' property
//     if (uploadedFile.name) {
//       await fileManager.deleteFile(uploadedFile.name);
//       console.log(`Deleted ${uploadedFile.displayName || "file"}`);
//     } else {
//       console.error("Unable to delete file: name property missing.");
//     }

//   } catch (error) {
//     console.error("Error in audioGemini:", error);
//   }
// }

//@ts-ignore
export async function gemini(path:any){
  setTimeout(()=>{
    console.log("Log FROM GEIMIN FN")
  },3000)
  return "hi there i am from gemini , you are working great."
}