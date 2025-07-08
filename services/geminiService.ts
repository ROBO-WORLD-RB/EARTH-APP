
import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-preview-04-17';

export function createChat(systemInstruction: string, history: Message[]): Chat {
  const formattedHistory: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: formattedHistory,
  });

  return chat;
}

export async function generateTitle(prompt: string): Promise<string> {
    const titlePrompt = `Generate a concise, 2-4 word title for a chat conversation that starts with this prompt: "${prompt}". Do not use quotes or special characters in the title.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: titlePrompt,
        });
        // Sanitize the response to remove potential markdown or quotes
        let title = (response.text ?? '').trim().replace(/["'*.]/g, '');
        return title || "Untitled Chat";
    } catch (error) {
        console.error("Error generating title:", error);
        return "Untitled Chat"; // Fallback title
    }
}
