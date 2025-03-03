import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../client';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/*
 * POST /api/login
 * 
 * This endpoint allows user authentication by checking their email and password.
 * Upon successful authentication, a JSON object containing user data (excluding the password) is returned to the frontend.
*/


router.post('/login', async (req: Request, res: Response) => {
    try {
        console.log('request received');
        const { email, password } = req.body;
        console.log('Request body:', { email, password });
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        console.log('passed email verification')
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log('email is unique')
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        console.log('password is correct')
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        console.log('token generated, sending response.', token);
        res.status(200).json({ token: token });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;

