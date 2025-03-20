import * as express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/data', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Missing authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Missing token' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jwt.verify(token, secret) as { id: string };
        const userId = parseInt(decoded.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Here you might fetch user data from DB using decoded.userId
        // For demonstration, we'll just return a sample payload
        res.status(200).json({ 
            userId: userId, 
            email: user.email,
        });
    } catch (error) {
        res.status(403).json({ message: error });
        return;
    }
});

export default router;