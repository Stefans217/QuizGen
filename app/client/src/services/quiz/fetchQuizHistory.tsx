import axios from 'axios';

const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://quizgen-production.up.railway.app';

export async function fetchQuizHistory(userId: number) {
  try {
    const response = await axios.post(`${backendUrl}/api/quiz/serve-quiz-history`,
      { userId },
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}