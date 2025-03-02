import express, { Request, Response } from "express";
import prisma from "../../client.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post("/userupload",   
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
        //find existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
            },
        });

        //if user exists, return error
        if (existingUser) {
            res.status(409).json({ message: "email exists" });
            return;
        }
        //hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create new user
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
            select: { id: true, email: true },
        });

        //return user created confirmation
        res.json({ message: "User registered", user });
    } catch (error) {
        //return error if user already exists
        res.status(400).json({ error: "Username already exists" });
    }
});
