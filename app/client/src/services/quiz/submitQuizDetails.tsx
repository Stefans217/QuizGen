import axios from "axios";
import { Question } from "@/types/question";

export async function submitQuizDetails(masterPrompt: string, numQuestions: number, questions: Array<Question>) {
  try {

    console.log(masterPrompt, numQuestions, questions);
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
