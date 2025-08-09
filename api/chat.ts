import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: message }] }],
        config: {
            systemInstruction: "Você é a INFOCO<IA>, uma assistente virtual amigável e prestativa para o sistema de gestão INFOCO. Suas respostas devem ser úteis e concisas.",
        }
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
