// hooks/useArticleFlow.ts

import { useState } from "react";
import { articleService } from "@/lib/articleService";
import { quizService, type QuizQuestion } from "@/lib/quizService";

type View = "form" | "summary" | "quiz" | "score";
type QuizSource = "new" | "history";

export type { QuizQuestion };

export function useArticleFlow() {
  const [view, setView] = useState<View>("form");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizSource, setQuizSource] = useState<QuizSource>("new");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedSummary = await articleService.generateSummary(
        title,
        content
      );
      setSummary(generatedSummary);
      setView("summary");
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeQuizById = async (id: string, clearSelected?: () => void) => {
    setIsLoading(true);
    setQuizSource("history");
    try {
      const questions = await quizService.generateQuiz(id);
      setQuiz(questions);
      setCurrentQuestion(0);
      setAnswers([]);
      setView("quiz");

      // Clear selected article so quiz view shows instead of history form
      if (clearSelected) {
        clearSelected();
      }
    } catch (error) {
      console.error("Failed to load quiz:", error);
      alert("Failed to load quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeQuizFromSummary = async () => {
    setIsLoading(true);
    setQuizSource("new");
    try {
      console.log("Saving article...", { title, content, summary });
      const id = await articleService.saveArticle({ title, content, summary });
      console.log("Article saved with ID:", id);
      setArticleId(id);

      console.log("Generating quiz for article:", id);
      const questions = await quizService.generateQuiz(id);
      console.log("Quiz generated:", questions);

      setQuiz(questions);
      setCurrentQuestion(0);
      setAnswers([]);
      setView("quiz");
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      alert(
        `Failed to generate quiz: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndLeave = async () => {
    try {
      await articleService.saveArticle({
        id: articleId,
        title,
        content,
        summary,
      });
      resetFlow();
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("Failed to save article. Please try again.");
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => [...prev, answerIndex]);

    if (currentQuestion === quiz.length - 1) {
      setView("score");
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const handleCancelQuiz = () => {
    const confirmCancel = confirm(
      "If you press Cancel, this quiz will restart from the beginning."
    );

    if (confirmCancel) {
      setCurrentQuestion(0);
      setAnswers([]);

      // If quiz is from history, go back to form, not summary
      if (quizSource === "history") {
        setView("form");
        setQuiz([]);
      } else {
        setView("summary");
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setView("quiz");
  };

  const handleLeaveQuiz = () => {
    setQuiz([]);
    setAnswers([]);
    setView("form");
  };

  const resetFlow = () => {
    setTitle("");
    setContent("");
    setSummary("");
    setQuiz([]);
    setAnswers([]);
    setArticleId(null);
    setCurrentQuestion(0);
    setView("form");
  };

  return {
    // State
    view,
    title,
    content,
    summary,
    loading,
    isLoading,
    quiz,
    currentQuestion,
    answers,
    quizSource,
    articleId,

    // Setters
    setTitle,
    setContent,
    setView,

    // Handlers
    handleGenerate,
    handleTakeQuizById,
    handleTakeQuizFromSummary,
    handleSaveAndLeave,
    handleAnswer,
    handleCancelQuiz,
    handleRestartQuiz,
    handleLeaveQuiz,
    resetFlow,
  };
}
