import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config'; 
// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

/**
 * Generates a summary for the given text using the Gemini Pro model.
 * @param {string} textToSummarize - The text content to be summarized.
 * @returns {Promise<string>} The summarized text.
 */
export const generateAISummary = async (
  textToSummarize: string,
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Please provide a concise, professional summary of the following text:\n\n---\n${textToSummarize}\n---\n\nSummary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // In a real app, you might want a more sophisticated error handling/logging mechanism
    throw new Error('Failed to generate summary from the AI service.');
  }
};