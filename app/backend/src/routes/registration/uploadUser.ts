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

router.post("/userupload", [validateEmail, validatePassword], async (req: Request, res: Response) => {

    console.log("UPLOAD USER request received");

    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

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

        //create new user record
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
            select: { id: true, email: true },
        });

        console.log("User created successfully, sending response.");
        res.status(200).json({ message: "User registered", user });
    } catch (error) {
        //return error if user already exists
        res.status(400).json({ error: "email already exists" });
    }
});

export default router;
