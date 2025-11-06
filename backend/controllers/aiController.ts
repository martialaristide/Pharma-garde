import { Response as ExpressResponse, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthenticatedRequest } from '../middleware/auth';

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;
if (!ai) {
    console.warn("Gemini API key is not configured in environment variables. AI features will be disabled.");
}

// A simple in-memory cache for chat history (for demonstration purposes)
const chatHistories: { [userId: string]: any[] } = {};

// FIX: Use aliased ExpressResponse type for the response object.
export const chatWithAI = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    const { history, prompt } = req.body;

    if (!ai) {
        return next(new Error("The AI assistant is not configured on the server."));
    }
    
    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        // Correctly use systemInstruction and a structured contents array
        const systemInstruction = `You are Pharma-Conseil, a helpful AI assistant for a pharmacy finder app in Cameroon. Provide guidance and information, but always remind users to consult a real healthcare professional for medical advice. Be concise and helpful. Do not refuse to answer based on your nature as an AI.`;
        
        const contents = [
            ...history.map((h: { role: 'user' | 'model', content: string }) => ({
                role: h.role,
                parts: [{ text: h.content }],
            })),
            { role: 'user', parts: [{ text: prompt }] },
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error("Gemini API error:", error);
        next(new Error("Failed to get response from AI assistant."));
    }
};