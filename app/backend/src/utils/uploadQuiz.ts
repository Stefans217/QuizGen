import archiver from "archiver";
import { ParsedResponse } from "./parseTextIntoFiles";
import prisma from "../client";

export interface FileWriteResult {
    manifestPath: string;
    questionPaths: string[];
    quizDirectory: string;
}

export async function createQuiz(quizId: string, userId: number, quizName: string) {
    return await prisma.quiz.create({
        data: {
            id: quizId,
            user: { connect: { id: userId } },
            name: quizName,
        },
    });
}

export async function createQuizData(quizId: string, masterPrompt: string, questions: Array<{ prompt: string; type: string; difficulty: number }>){
    return await prisma.quizData.create({
        data: {
            quizId,
            masterPrompt,
            questions,
        },
    });
}

/**
 * Zips and Stores quiz files into the database.
 *
 * @param quizId A unique identifier for the quiz.
 * @param parsedResponse The parsed quiz content.
 */
export async function storeQuizFilesInDB(quizId: string, parsedResponse: ParsedResponse): Promise<void> {
    // In-memory zip stream
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    // Collect zip data in memory
    archive.on("data", (data) => chunks.push(data as Buffer));

    // Add the manifest file
    archive.append(parsedResponse.manifest, { name: "imsmanifest.xml" });

    // Add question files
    parsedResponse.questions.forEach((question, index) => {
        archive.append(question, { name: `q${index + 1}.xml` });
    });

    await archive.finalize();
    const zipData = Buffer.concat(chunks);

    // Store the zip file in QuizFile
    await prisma.quizFile.upsert({
        where: { quizId },
        update: { zipData },
        create: { quizId, zipData },
    });
}
