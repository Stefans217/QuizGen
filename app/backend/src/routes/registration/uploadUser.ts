import express, { Request, Response } from 'express';
import prisma from '../../client.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/userupload', async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
            id: true,
            email: true,
            }
        });

        if(existingUser){
            res.status(409).json({ message: 'email exists'});
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
          data: { email, password: hashedPassword },
          select: {id: true, email: true}
        });

        res.json({ message: "User registered", user });

      } catch (error) {
        res.status(400).json({ error: "Username already exists" });
      }
});