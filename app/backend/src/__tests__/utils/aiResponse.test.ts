import { generateQuiz } from '../../../src/utils/aiResponse';
import * as fileWriter from '../../../src/utils/uploadQuiz';
import openai from '../../../src/openaiClient';
import express from 'express';

// jest.mock("openai");
jest.mock("../../../src/utils/uploadQuiz");

jest.mock("../../openaiClient", () => ({
    chat: {
        completions: {
            create: jest.fn()
        }
    }
}));

// const mockOpenAIInstance = {
//     chat: {
//         completions: {
//             create: mockCreate,
//         },
//     },
// };

// (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAIInstance);

describe('generateQuiz', () => {
    const dummyFileResult = {
        manifestPath: "dummy/manifest.xml",
        questionPaths: ["dummy/q1.xml"],
        quizDirectory: "dummy/quizDirectory",
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should generate quiz successfully', async () => {
        // Arrange
        ((openai.chat.completions.create) as jest.Mock).mockResolvedValue({
            choices: [{ message: { content: `<manifest>Valid Manifest</manifest>
    ---
    <assessmentItem>Valid Question</assessmentItem>` } }]
        });

        (fileWriter.createQuiz as jest.Mock).mockResolvedValue(undefined);
        (fileWriter.storeQuizFilesInDB as jest.Mock).mockReturnValue(undefined);
    
        const userId = 1;
        const masterPrompt = "Test master prompt";
        const questionData = [{ prompt: "Test topic", type: "multiple-choice", difficulty: 2 }];
    
        // Act
        const result = await generateQuiz(userId, masterPrompt, questionData);
    
        // Assert
        // Remove checks for manifestPath, questionPaths, quizDirectory, and zipPath
        expect(result).toHaveProperty("rawResponse");
        expect(result).toHaveProperty("quizId");
        expect(fileWriter.createQuiz).toHaveBeenCalled();
        expect(fileWriter.storeQuizFilesInDB).toHaveBeenCalled();
    });

    test('should throw error when OpenAI API call fails', async () => {
        // Arrange: force the OpenAI call to fail.

        ((openai.chat.completions.create) as jest.Mock).mockRejectedValue(new Error("OpenAI error"));

        const userId = 1;
        const masterPrompt = "Test master prompt";
        const questionData = [{ prompt: "Test topic", type: "multiple-choice", difficulty: 2 }];

        // Act & Assert: ensure generateQuiz throws.
        await expect(generateQuiz(userId, masterPrompt, questionData))
            .rejects
            .toThrow("quiz generation error: Error: OpenAI error");
    });
});