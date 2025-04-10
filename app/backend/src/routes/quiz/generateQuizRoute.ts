/**
 * POST /generateQuiz
 * 
 * Generates a quiz based on the provided master prompt, number of questions, and question data.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 * @body {string} masterPrompt - The main prompt to generate the quiz.
 * @body {number} numQuestions - The number of questions to generate.
 * @body {Array<{subPrompt: string, questionType: string, difficulty: number}>} questionData - An array of question data objects.
 *  @bodyParam {string} questionData[].subPrompt - The sub-prompt for each question.
 *  @bodyParam {string} questionData[].questionType - The type of each question (e.g., multiple choice, true/false).
 *  @bodyParam {number} questionData[].difficulty - The difficulty level of each question.
 * 
 * @returns {}
 * 
 * @throws {500} Internal server error.
 */


import express, { Request, Response } from 'express';
import { generateQuiz } from '../../utils/aiResponse';

const router = express.Router();

router.post('/generateQuiz', async (req: Request, res: Response) => {
    try {
        console.log("QUIZ GEN request received");
        const { userId, masterPrompt, numQuestions, questions } = req.body;

        if(!userId) {
            res.status(400).json({ message: 'User ID is required.' });
            return;
        }
        if(!masterPrompt || !numQuestions || !questions) {
            res.status(400).json({ message: 'Master prompt, number of questions, and question data are required.' });
            return;
        }
        // Implement quiz generation logic here
        const responseXML = await generateQuiz(userId, masterPrompt, questions);
        console.log('Generated quiz, sending response');
        const quizId = responseXML.quizId;
        res.status(200).json({ quizId, message: 'Quiz generated successfully.' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error in the /generateQuiz API route.' });
        return;
    }

});

export default router;