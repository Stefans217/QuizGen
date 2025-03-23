import express, { Router, Request, Response } from 'express';
import prisma from '../../client';

const router = express.Router();

/**
 * GET /api/quiz-files/:quizId
 *
 * Serves a zip file stored in the database for the given quiz.
 */
router.post('/serve-quiz', async (req: Request, res: Response) => {
  try {
    const { quizId } = req.body;

    // Fetch the quiz file based on quizId
    const quizFile = await prisma.quizFile.findUnique({
      where: { quizId },
    });

    if (!quizFile || !quizFile.zipData) {
      res.status(404).json({ error: 'Quiz file not found' });
      return;
    }
    console.log(quizFile);

    const zipBuffer = Buffer.from(quizFile.zipData as any);
    // Set response headers to serve a zip file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=quizFiles.zip');
    
    // Send the binary zip data
    res.status(200).send(zipBuffer);
  } catch (error) {
    console.error('Error serving quiz file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;