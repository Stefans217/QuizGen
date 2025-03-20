import axios from "axios";
import { Question } from "@/types/question";

export async function submitQuizDetails(userId: string, masterPrompt: string, numQuestions: number, questions: Array<Question>) {
  try {

    console.log(userId, masterPrompt, numQuestions, questions);
    const response = await axios.post("http://localhost:3001/api/quiz/generateQuiz", {
      userId,
      masterPrompt,
      numQuestions,
      questions
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
