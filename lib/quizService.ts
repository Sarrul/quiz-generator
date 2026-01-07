// lib/quizService.ts

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

export const quizService = {
  async generateQuiz(articleId: string): Promise<QuizQuestion[]> {
    const res = await fetch("/api/generateQuiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    });

    if (!res.ok) throw new Error("Failed to generate quiz");

    const data = await res.json();
    return data.questions;
  },
};
