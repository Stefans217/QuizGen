import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { ParsedResponse } from './responseParser';

export interface FileWriteResult {
  manifestPath: string;
  questionPaths: string[];
  quizDirectory: string;
}

/**
 * Creates a zip file of the manifest and questions in the same directory.
 * @param fileResult The result of writeQuizFiles
 * @returns The path to the created zip file
 */
export async function zipQuizFiles(fileResult: FileWriteResult): Promise<string> {
    const zipName = 'quizFiles.zip';
    const zipFullPath = path.join(fileResult.quizDirectory, zipName);
  
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFullPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
  
      output.on('close', () => {
        resolve(zipFullPath);
      });
  
      archive.on('error', (err) => {
        reject(err);
      });
  
      archive.pipe(output);
  
      // Add manifest file
      archive.file(fileResult.manifestPath, {
        name: path.basename(fileResult.manifestPath),
      });
  
      // Add question files
      fileResult.questionPaths.forEach((qPath) => {
        archive.file(qPath, { name: path.basename(qPath) });
      });
  
      archive.finalize();
    });
  }


/**
 * Writes parsed quiz content to individual files
 * @param parsedResponse The parsed LLM response
 * @param baseDir The base directory to store quizzes
 * @param quizId A unique identifier for the quiz
 * @returns Paths to created files
 */
export async function writeQuizFiles(
  parsedResponse: ParsedResponse, 
  baseDir: string,
  quizId: string
): Promise<FileWriteResult> {
  // Create the output directory
  const quizDirectory = path.join(baseDir, quizId);
  
  if (!fs.existsSync(quizDirectory)) {
    fs.mkdirSync(quizDirectory, { recursive: true });
  }
  
  // Write the manifest file
  const manifestPath = path.join(quizDirectory, 'imsmanifest.xml');
  await fs.promises.writeFile(manifestPath, parsedResponse.manifest, 'utf8');
  
  // Write each question file
  const questionPaths: string[] = [];
  
  for (let i = 0; i < parsedResponse.questions.length; i++) {
    const fileName = `q${i + 1}.xml`;
    const filePath = path.join(quizDirectory, fileName);
    await fs.promises.writeFile(filePath, parsedResponse.questions[i], 'utf8');
    questionPaths.push(filePath);
  }
  
  return {
    manifestPath,
    questionPaths,
    quizDirectory
  };
}