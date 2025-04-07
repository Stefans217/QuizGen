import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

import uploadUser from './routes/registration/uploadUser';
import verifyLogin from './routes/login/verifyLogin';
import fetchUserData from './routes/user/fetchUserData';
import generateQuiz from './routes/quiz/generateQuizRoute';
import serveQuiz from './routes/quiz/serveQuizRoute';
import serveQuizHistory from './routes/quiz/serveQuizHistoryRoute';

const app: Application = express();
//const port: number = 3001;

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://quiz-gen-n7gy.vercel.app'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/registration', uploadUser);
app.use('/api/login', verifyLogin);
app.use('/api/user', fetchUserData);
app.use('/api/quiz', generateQuiz);
app.use('/api/quiz', serveQuiz);
app.use('/api/quiz', serveQuizHistory);

app.get('/', (req, res) => {
  res.send('Backend server is up and running!');
});

try{
  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}catch(error){
  console.error('Error starting server:', error);
}
