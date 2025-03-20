import { Router, Request, Response } from 'express';
import prisma from '../../client';

const router = Router();

/**
 * GET /api/quiz-files/:quizId
 *
 * Serves a zip file stored in the database for the given quiz.
 */
router.get('/quiz-files/:quizId', async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;

    // Fetch the quiz file based on quizId
    const quizFile = await prisma.quizFile.findUnique({
      where: { quizId },
    });

    if (!quizFile || !quizFile.zipData) {
      res.status(404).json({ error: 'Quiz file not found' });
      return;
    }

    // Set response headers to serve a zip file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=quizFiles.zip');
    
    // Send the binary zip data
    res.send(quizFile.zipData);
  } catch (error) {
    console.error('Error serving quiz file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;