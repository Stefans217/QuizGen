import axios from 'axios';
import FileSaver from 'file-saver';

const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://quizgen-production.up.railway.app';

export async function fetchGenerateQuiz(quizId: string) {
  try {
    const response = await axios.post(`${backendUrl}/api/quiz/serve-quiz`,
      { quizId },
      { responseType: 'blob'}
    );
    console.log(response);
    FileSaver.saveAs(response.data, 'quizFiles.zip');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}