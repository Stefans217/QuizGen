import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import uploadUser from './routes/registration/uploadUser';
import verifyLogin from './routes/login/verifyLogin';

import OpenAI from "openai";

const app: Application = express();
const port: number = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000', // Only allow requests from this origin
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

app.use('/api/registration', uploadUser);
app.use('/api/login', verifyLogin);



async function main() {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
        store: true,
    });

    console.log(completion.choices[0].message);
}

main();


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});