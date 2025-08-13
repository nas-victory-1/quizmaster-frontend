import api from "./axios";
import { QuizData } from "@/types/types";

export const createQuiz = async(quizData: QuizData) => {
    return await api.post("/quiz/create-quiz", quizData);
}

export const getAllQuizzes = async() =>{
    return await api.get("/quiz/quizzes")
}

export async function getQuizById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/quizzes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch quiz");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const deleteQuiz = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/quizzes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete quiz");
  }

  return res.json();
};