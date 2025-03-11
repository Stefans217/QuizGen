import axios from "axios";


export async function submitQuizDetails(masterPrompt: string, numQuestions: number, questions: Array<{ prompt: string, type: string, difficulty: number }>) {
  try {

    const response = await axios.post("http://localhost:3001/api/quiz/generateQuiz", {
      masterPrompt,
      numQuestions,
      questions
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
