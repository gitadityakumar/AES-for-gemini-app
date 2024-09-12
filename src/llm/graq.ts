// Default
import Groq from "groq-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const completion = await groq.chat.completions
    .create({
      messages: [
        {
          role: "user",
          content: "Explain the importance of fast language models",
        },
      ],
    "model": "llama3-70b-8192",
    "temperature": 0.97,
    "max_tokens": 8192,
    "top_p": 1,
    "stream": false,
    "stop": null
    })
    .then((chatCompletion) => {
      console.log(chatCompletion.choices[0]?.message?.content || "");
    });
}


