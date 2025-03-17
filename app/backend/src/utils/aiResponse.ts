import OpenAI from 'openai';
import { manifest } from '@/qti-templates/imsmanifest';
import { choiceInteraction } from '../qti-templates/choiceInteraction';
import { extendedTextInteraction } from '@/qti-templates/extendedText';

function createSystemPrompt(){
    return `
        You are an AI assistant that generates QTI 2.2-compatible quiz questions. You follow the IMS QTI 2.2 standard and structure XML output correctly.

        Your role:
        - Accept user input specifying topics, difficulty, question types, and number of questions.
        - Generate well-formatted QTI 2.2 XML output.
        - Include metadata such as correct responses, feedback, and scoring.
        - Validate XML structure before responding.

        Format:
        - Provide "<assessmentItem>" elements inside an "<assessmentTest>" wrapper.
        - Include "<choiceInteraction>" for multiple-choice, "<extendedTextInteraction>" for shortand long answers, and "<matchInteraction>" for matching questions.
        - Ensure "<responseDeclaration>", "<itemBody>", and "<responseProcessing>" are correctly structured.

        Be concise but detailed. Always follow QTI 2.2 standards.
    `;
}

function createUserPrompt(masterPrompt: string, questions: Array<{ prompt: string, type: string, difficulty: number }>) {
    return `
        Based on this user prompt: ${masterPrompt}

        Use the following templates to generate the questions:
        - Manifest file: ${manifest()}
        - For multiple-choice and true/false questions: ${choiceInteraction()}
        - For extended text questions: ${extendedTextInteraction()}
        The templates include placeholders marked by astrixes for question content and response options.

        In the manifest file, replace "*file*" with a unique identifier and "*file.xml*" with the name of the XML file.
        Each question generated will be contained in a separate XML file. 
        Mark the file name with a unique identifier and separate the questions with a line break and a unique identifier ("NEW - 2").

        Generate a QTI 2.2 quiz with the following questions:
        ${questions.map((qd, index) => `Question number: ${index + 1}. ${qd.type} question on ${qd.prompt} with a diffuculty of ${qd.difficulty} out of 3.`).join("\n")}

        Validate the XML structure before responding.
    `
}

export async function generateQuiz(masterPrompt: string, questionData: Array<{ prompt: string, type: string, difficulty: number }>) {
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
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content
        }));

        //send the messages to the OpenAI API
        const response = await openai.chat.completions.create({
            model: "o3-mini",
            messages: typedMessages,
            store: false,
        });

        //return the raw response from the API
        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error(error);
        return `quiz generation error: ${error}. \n\n Check ./backend/src/utils/generateQuiz.ts for context.`;
    }
}