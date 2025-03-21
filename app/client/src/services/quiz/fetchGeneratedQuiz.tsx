import axios from 'axios';
import FileSaver from 'file-saver';

export async function fetchGenerateQuiz(quizId: string) {
  try {
    const response = await axios.post('http://localhost:3001/api/quiz/serve-quiz',
      { quizId },
      { responseType: 'blob'}
    );
    console.log(response);
    const blob = new Blob([response.data], { type: 'application/zip' });
    FileSaver.saveAs(blob, 'quizFiles.zip');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}