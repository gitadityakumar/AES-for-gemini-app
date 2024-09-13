import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

const apikey= process.env.GEMINI_API_KEY || " ";
if(!apikey) throw new Error("Missing GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(apikey);

// text genration function
//@ts-ignore
export async function gemini(txtFilePath){
  try{
    const subtitlesContent = await fs.readFile(txtFilePath, 'utf-8');
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `As an AI language model specialized in text analysis, your task is to process text files and extract important words, including company names, tool names, and advanced English vocabulary. Analyze the content of a text file with thorough attention, selecting words at a medium to high level of English proficiency. Output the results as a JSON object structured as follows:
 {
   "words": [
     {
       "word": "example",
       "meaning": "a representative instance of a particular category"
     },
     {
       "word": "technology",
       "meaning": "the application of scientific knowledge for practical purposes"
     },
     {
       "word": "company",
       "meaning": "a commercial business or enterprise"
     },
     {
       "word": "predatory",
       "meaning": "seeking to exploit or oppress others, often in a ruthless or aggressive manner"
     }
   ]
 }
 do not give me anyting except having a json object containing all words and their meaning. 
 `, 
     });
    const prompt = `${subtitlesContent}`;
    const result = await model.generateContent(prompt);
    const totalToken = result.response.usageMetadata?.totalTokenCount;
    const output = result.response.text();
    return {
      output,
      totalToken
  }
  }catch(error){
    console.error("Error during processing:", error);
  }
  
};


