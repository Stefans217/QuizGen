import { Request, Response } from "express";
import * as express from 'express';
import prisma from "../../client";
import bcrypt from "bcrypt";
import { body, validationResult } from 'express-validator';
import { validateEmail, validatePassword } from "./validatePassword"; // Import validators


// import expressValidator = require("express-validator");
// const body = expressValidator;
// const validationResult = expressValidator;

const router = express.Router();

router.post("/userupload",   
  [validateEmail, validatePassword],
  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    console.log("Request body:", { email, password });

    console.log("request received");
  

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }



    try {
        //find existing user
        console.log("Checking for existing user with email:", email);

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
            },
        });

        //if user exists, return error
        if (existingUser) {
            console.log("User already exists:", existingUser);

            res.status(409).json({ message: "email exists" });
            return;
        }
        //hash password
        console.log("Hashing password");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create new user
        console.log("Creating new user with email:", email);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
            select: { id: true, email: true },
        });

        //return user created confirmation
        console.log("User created successfully:", user);

        res.status(200).json({ message: "User registered", user });
    } catch (error) {
        //return error if user already exists
        res.status(400).json({ error: "email already exists" });
    }
});

export default router;
