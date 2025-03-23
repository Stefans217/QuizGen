import OpenAI from "openai";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { manifest } from "../qti-templates/imsmanifest";
import { choiceInteraction } from "../qti-templates/choiceInteraction";
import { extendedTextInteraction } from "../qti-templates/extendedText";
import { parseAiResponse } from "../utils/responseParser";
import { writeQuizFiles, zipQuizFiles, storeQuizFilesInDB, createQuiz } from "../utils/fileWriter";
import { create } from "domain";

function createSystemPrompt() {
    return `
        You are an AI assistant that generates QTI 2.2-compatible quiz questions. You follow the IMS QTI 2.2 standard and structure XML output correctly.

        Your role:
        - Accept user input specifying topics, difficulty, question types, and number of questions.
        - Generate well-formatted QTI 2.2 XML output.
        - Include very minimal metadata. Only include the minimum required for a valid QTI 2.2 file.
        - Validate XML structure before responding.

        Format:
        - Provide only "<assessmentItem>" elements. Do not use <assessmentTest> or <assessmentSection> elements.
        - Include "<choiceInteraction>" for multiple-choice, "<extendedTextInteraction>" for short and long answers.
        - Ensure "<responseDeclaration>", "<itemBody>", and "<responseProcessing>" are correctly structured.

        Be concise but detailed. Always follow QTI 2.2 standards.
    `;
}

function createUserPrompt(masterPrompt: string, questions: Array<{ prompt: string; type: string; difficulty: number }>) {
    return `
        Based on this user prompt: ${masterPrompt}

        Use the following templates to generate the questions:
        - Manifest file: ${manifest()}
        - For multiple-choice and true/false questions: ${choiceInteraction()}
        - For extended text questions: ${extendedTextInteraction()}
        The templates include placeholders marked by astrixes for question content and response options.

        In the manifest file, replace "*file*" with a unique identifier and "*file.xml*" with the name of the XML file.
        For multiple-choice questions, decide how many options to include based on the question type and difficulty.
        For true or false questions, only include two options.
        Each question generated will be contained in a separate XML file. 
        Mark the file name with a unique identifier and separate the questions with a line break and a unique identifier ("---").

        Generate a QTI 2.2 quiz with the following questions:
        ${questions.map((qd, index) => `Question number: ${index + 1}. ${qd.type} question on ${qd.prompt} with a diffuculty of ${qd.difficulty} out of 3.`).join("\n")}

        Validate the XML structure before responding.
    `;
}

export async function generateQuiz(userId: number, masterPrompt: string, questionData: Array<{ prompt: string; type: string; difficulty: number }>) {
    try {
        console.log(questionData);

        const systemPrompt = createSystemPrompt();
        const userPrompt = createUserPrompt(masterPrompt, questionData);

        console.log(userPrompt);

        const openai = new OpenAI();
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ];

        //verify that the messages are correctly formatted
        const typedMessages = messages.map((m) => ({
            role: m.role as "system" | "user" | "assistant",
            content: m.content,
        }));

        //send the messages to the OpenAI API
        const response = await openai.chat.completions.create({
            model: "o3-mini",
            messages: typedMessages,
            store: false,
        });

        const rawResponse = response.choices[0]?.message?.content || "";
        console.log("rawResponse:", rawResponse);

        const parsedResponse = parseAiResponse(rawResponse);
        console.log("parsedResponse:", parsedResponse);

        const quizId = uuidv4();
        console.log("quizId:", quizId);

        const baseDir = path.join(process.cwd(), "quizzes");
        console.log("baseDir:", baseDir);

        const fileResult = await writeQuizFiles(parsedResponse, baseDir, quizId);
        console.log("fileResult:", fileResult);

        const zipPath = await zipQuizFiles(fileResult);
        console.log("zipPath:", zipPath);

        await createQuiz(quizId, userId, "Still need to implement quiz name");

        storeQuizFilesInDB(quizId, parsedResponse, zipPath);
        console.log("storeQuizFilesInDB called for quizId:", quizId);

        //return the raw response from the API
        return {
            rawResponse,
            manifestPath: fileResult.manifestPath,
            questionPaths: fileResult.questionPaths,
            quizId,
            quizDirectory: fileResult.quizDirectory,
            zipPath,
        };
    } catch (error) {
        console.error(error);
        throw new Error(`quiz generation error: ${error}. \n\n Check ./backend/src/utils/generateQuiz.ts for context.`);
    }
}
