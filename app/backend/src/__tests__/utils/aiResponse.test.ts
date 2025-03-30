import { generateQuiz } from '../../../src/utils/aiResponse';
import { OpenAI } from 'openai';
import * as fileWriter from '../../../src/utils/fileWriter';
import express from 'express';

jest.mock("openai");
jest.mock("../../../src/utils/fileWriter");

const mockCreate = jest.fn();
jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => {
        return {
            chat: {
                completions: {
                    create: jest.fn(),
                },
            },
        };
    });
});

// const mockOpenAIInstance = {
//     chat: {
//         completions: {
//             create: mockCreate,
//         },
//     },
// };

(OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAIInstance);

describe('generateQuiz', () => {
    const dummyFileResult = {
        manifestPath: "dummy/manifest.xml",
        questionPaths: ["dummy/q1.xml"],
        quizDirectory: "dummy/quizDirectory",
    };

    beforeEach(() => {
        // Reset mocks before each test.
        jest.resetAllMocks();
        mockCreate.mockReset();
    });

    test('should generate quiz successfully', async () => {
        // Arrange: set up openai response and fileWriter mocks.
        mockCreate.mockResolvedValue({
            choices: [{
                message: {
                    content:
                        `<manifest>Valid Manifest</manifest>
                        ---
                        <assessmentItem>Valid Question</assessmentItem>`
                }
            }]
        });
        (fileWriter.writeQuizFiles as jest.Mock).mockResolvedValue(dummyFileResult);
        (fileWriter.zipQuizFiles as jest.Mock).mockResolvedValue("dummy/quiz.zip");
        (fileWriter.createQuiz as jest.Mock).mockResolvedValue(undefined);
        (fileWriter.storeQuizFilesInDB as jest.Mock).mockReturnValue(undefined);

        const userId = 1;
        const masterPrompt = "Test master prompt";
        const questionData = [{ prompt: "Test topic", type: "multiple-choice", difficulty: 2 }];

        // Act: call generateQuiz.
        const result = await generateQuiz(userId, masterPrompt, questionData);

        // Assert: check expected properties.
        expect(result).toHaveProperty("rawResponse");
        expect(result).toHaveProperty("manifestPath", dummyFileResult.manifestPath);
        expect(result).toHaveProperty("questionPaths", dummyFileResult.questionPaths);
        expect(result).toHaveProperty("quizId");
        expect(result).toHaveProperty("quizDirectory", dummyFileResult.quizDirectory);
        expect(result).toHaveProperty("zipPath", "dummy/quiz.zip");

        expect(mockCreate).toHaveBeenCalled();
        expect(fileWriter.writeQuizFiles).toHaveBeenCalled();
        expect(fileWriter.zipQuizFiles).toHaveBeenCalled();
        expect(fileWriter.createQuiz).toHaveBeenCalled();
        expect(fileWriter.storeQuizFilesInDB).toHaveBeenCalled();
    });

    test('should throw error when OpenAI API call fails', async () => {
        // Arrange: force the OpenAI call to fail.
        mockCreate.mockRejectedValue(new Error("OpenAI error"));

        const userId = 1;
        const masterPrompt = "Test master prompt";
        const questionData = [{ prompt: "Test topic", type: "multiple-choice", difficulty: 2 }];

        // Act & Assert: ensure generateQuiz throws.
        await expect(generateQuiz(userId, masterPrompt, questionData))
            .rejects
            .toThrow("quiz generation error: Error: OpenAI error");
    });
});