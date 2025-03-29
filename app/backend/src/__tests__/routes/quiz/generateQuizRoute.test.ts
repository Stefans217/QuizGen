import request from 'supertest';
import express from 'express';
import router from '../../../routes/quiz/generateQuizRoute';
import { generateQuiz } from '../../../utils/aiResponse';

jest.mock('../../../utils/aiResponse', () => ({
    generateQuiz: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST /generateQuiz', () => {
    it('should return 400 if userId is missing', async () => {
        const res = await request(app)
            .post('/generateQuiz')
            .send({ masterPrompt: "Some prompt", numQuestions: 5, questions: [{ subPrompt: "sub", questionType: "MCQ", difficulty: 1 }] });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User ID is required.');
    });

    it('should return 400 if masterPrompt, numQuestions or questions are missing', async () => {
        const res = await request(app)
            .post('/generateQuiz')
            .send({ userId: "user1" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Master prompt, number of questions, and question data are required.');
    });

    it('should return 200 and generate a quiz for a valid request', async () => {
        const responseXML = { quizId: 'quiz123' };
        (generateQuiz as jest.Mock).mockResolvedValueOnce(responseXML);
        const reqBody = {
            userId: "user1",
            masterPrompt: "Test prompt",
            numQuestions: 5,
            questions: [{ subPrompt: "sub-prompt", questionType: "MCQ", difficulty: 1 }]
        };
        const res = await request(app)
            .post('/generateQuiz')
            .send(reqBody);
        expect(generateQuiz).toHaveBeenCalledWith(reqBody.userId, reqBody.masterPrompt, reqBody.questions);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Quiz generated successfully.');
        expect(res.body.quizId).toBe(responseXML.quizId);
    });

    it('should return 500 if generateQuiz throws an error', async () => {
        (generateQuiz as jest.Mock).mockRejectedValueOnce(new Error("something went wrong"));
        const reqBody = {
            userId: "user1",
            masterPrompt: "Test prompt",
            numQuestions: 5,
            questions: [{ subPrompt: "sub-prompt", questionType: "MCQ", difficulty: 1 }]
        };
        const res = await request(app)
            .post('/generateQuiz')
            .send(reqBody);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Internal server error in the /generateQuiz API route.');
    });
});