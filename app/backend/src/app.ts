import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import uploadUser from './routes/registration/uploadUser';
import verifyLogin from './routes/login/verifyLogin';
import fetchUserData from './routes/user/fetchUserData';
import generateQuiz from './routes/quiz/generateQuizRoute';
import serveQuiz from './routes/quiz/serveQuizRoute';

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
app.use('/api/user', fetchUserData);
app.use('/api/quiz', generateQuiz);
app.use('/api/quiz', serveQuiz);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});