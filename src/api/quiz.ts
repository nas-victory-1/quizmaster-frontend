import api from "./axios";
import { QuizData } from "@/types/types";

export const createQuiz = async(quizData: QuizData) => {
    return await api.post("/quiz/create-quiz", quizData);
}