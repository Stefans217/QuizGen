import express, { Router, Request, Response } from 'express';
import prisma from '../../client';

const router = express.Router();

router.post('/serve-quiz-history', async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const quizHistory = await prisma.quizData.findMany({
        where: {
          quiz: {
            userId: userId,
          },
        },
        include: {
          quiz: true,
        },
      });
      res.status(200).json(quizHistory);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;