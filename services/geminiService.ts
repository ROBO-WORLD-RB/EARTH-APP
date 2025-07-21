
import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message, FileMessage } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-1.5-flash';

export function createChat(systemInstruction: string, history: Message[]): Chat {
  const formattedHistory: Content[] = history.map(msg => {
    const parts: any[] = [{ text: msg.content }];
    
    // Add file content if present
    if (msg.files && msg.files.length > 0) {
      msg.files.forEach(file => {
        if (file.type.startsWith('image/')) {
          parts.push({
            inlineData: {
              mimeType: file.type,
              data: file.content.split(',')[1] // Remove data:image/...;base64, prefix
            }
          });
        } else {
          // For text files, add as text content
          parts.push({
            text: `\n[File: ${file.name}]\n${file.content}\n`
          });
        }
      });
    }
    
    return {
      role: msg.role,
      parts
    };
  });
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: formattedHistory,
  });

  return chat;
}

export async function generateTitle(prompt: string, files?: FileMessage[]): Promise<string> {
    let titlePrompt = `Generate a concise, 2-4 word title for a chat conversation that starts with this prompt: "${prompt}"`;
    
    if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(', ');
        titlePrompt += ` and includes these files: ${fileNames}`;
    }
    
    titlePrompt += `. Do not use quotes or special characters in the title.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ parts: [{ text: titlePrompt }] }],
        });
        // Sanitize the response to remove potential markdown or quotes
        let title = (response.text ?? '').trim().replace(/["'*.]/g, '');
        return title || "Untitled Chat";
    } catch (error) {
        console.error("Error generating title:", error);
        return "Untitled Chat"; // Fallback title
    }
}
