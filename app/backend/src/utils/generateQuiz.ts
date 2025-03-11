import OpenAI from 'openai';

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
        - Include "<choiceInteraction>" for multiple-choice, "<extendedTextInteraction>" for short answers, and "<matchInteraction>" for matching questions.
        - Ensure "<responseDeclaration>", "<itemBody>", and "<responseProcessing>" are correctly structured.

        Be concise but detailed. Always follow QTI 2.2 standards.
    `;
}

function createUserPrompt(masterPrompt: string, questionData: Array<{ subPrompt: string, questionType: string, difficulty: number }>) {
    return `
        Based on this user prompt: ${masterPrompt}

        Generate a QTI 2.2 quiz with the following questions:
        ${questionData.map((qd) => `Question number: ${qd}. ${qd.questionType} question on ${qd.subPrompt} with a diffuculty of ${qd.difficulty} out of 3.`).join("\n")}

        Validate the XML structure before responding.
    `
}

export async function generateQuiz(masterPrompt: string, questionData: Array<{ subPrompt: string, questionType: string, difficulty: number }>) {
    try {

        const systemPrompt = createSystemPrompt();
        const userPrompt = createUserPrompt(masterPrompt, questionData);

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
            model: "gpt-o3-mini",
            messages: typedMessages,
            store: false,
        });

        //return the raw response from the API
        return response.choices[0]?.message || "";
    } catch (error) {
        console.error(error);
        return `quiz generation error: ${error}. \n\n Check ./backend/src/utils/generateQuiz.ts for context.`;
    }
}