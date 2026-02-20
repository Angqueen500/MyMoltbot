/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeImage(imageBuffer: Buffer, mimeType: string) {
  // Mock AI response to bypass invalid key
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        breed: "Unknown (AI Disabled)",
        age: "Unknown",
        type: "unknown"
      });
    }, 500);
  });
}
