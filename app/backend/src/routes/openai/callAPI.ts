import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const router = express.Router();

export async function generateQuiz(masterPrompt: string, numQuestions: number, questionData: Array<{ subPrompt: string, questionType: string, difficulty: number }>) {
    try {

        const openai = new OpenAI();
        const messages = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: masterPrompt },
            ...questionData.map((data: { subPrompt: string }) => ({
                role: "user",
                content: data.subPrompt
            }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-o3-mini",
            messages: messages,
            store: true,
        });

        
    } catch (error) {
        
    }
}