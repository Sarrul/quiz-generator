"use client";

import { ArticleForm } from "@/_components/ArticleForm";
import { HistoryArticleForm } from "@/_components/HistoryArticleForm";
import { QuizView } from "@/_components/quizForm";
import { QuizScore } from "@/_components/quizScore";
import { SummaryView } from "@/_components/Summary";
import { useArticle } from "@/_contexts/ArcticleContext";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  type View = "form" | "summary" | "quiz" | "score";

  const [view, setView] = useState<View>("form");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const { selectedArticle, clearSelectedArticle } = useArticle();

  async function handleGenerate() {
    setLoading(true);

    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setView("summary");
    setLoading(false);
    console.log(data.summary, "summaryyyyyy");
  }

  async function handleTakeQuizById(id: string) {
    setIsLoading(true);

    try {
      clearSelectedArticle(); // ✅ THIS IS THE FIX

      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: id }),
      });

      const data = await res.json();

      setQuiz(data.questions);
      setCurrentQuestion(0);
      setAnswers([]);
      setView("quiz");
    } catch (err) {
      console.error("Failed to load quiz:", err);
      alert("Failed to load quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTakeQuizFromSummary() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setQuiz(data.questions);
      setCurrentQuestion(0);
      setAnswers([]);
      setView("quiz");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveAndLeave() {
    console.log("SAVING SUMMARY:", summary);

    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: articleId,
        title,
        content,
        summary,
      }),
    });

    setTitle("");
    setContent("");
    setSummary("");
    setQuiz([]);
    setAnswers([]);
    setView("form");
  }

  return (
    <>
      <SignedIn>
        {selectedArticle ? (
          <HistoryArticleForm
            article={selectedArticle}
            isLoading={isLoading}
            onBack={clearSelectedArticle}
            onTakeQuiz={handleTakeQuizById}
          />
        ) : (
          <>
            {view === "form" && (
              <ArticleForm
                title={title}
                content={content}
                loading={loading}
                setTitle={setTitle}
                setContent={setContent}
                onGenerate={handleGenerate}
              />
            )}

            {view === "summary" && (
              <SummaryView
                summary={summary}
                title={title}
                onBack={() => {
                  setView("form");
                }}
                handleTakeQuiz={handleTakeQuizFromSummary}
                isLoading={isLoading}
              />
            )}

            {view === "quiz" && quiz.length > 0 && (
              <QuizView
                question={quiz[currentQuestion]}
                questionIndex={currentQuestion}
                totalQuestions={quiz.length}
                onAnswer={(answerIndex) => {
                  setAnswers((prev) => [...prev, answerIndex]);

                  if (currentQuestion === quiz.length - 1) {
                    setView("score");
                  } else {
                    setCurrentQuestion((q) => q + 1);
                  }
                }}
                onCancel={() => {
                  const confirmCancel = confirm(
                    "If you press Cancel, this quiz will restart from the beginning."
                  );

                  if (confirmCancel) {
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setView("summary");
                  }
                }}
              />
            )}

            {view === "score" && (
              <QuizScore
                quiz={quiz}
                answers={answers}
                onRestart={() => {
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setView("quiz");
                }}
                onLeave={() => {
                  setQuiz([]);
                  setAnswers([]);
                  setView("form");
                }}
                handleSaveAndLeave={handleSaveAndLeave}
              />
            )}
          </>
        )}
      </SignedIn>

      <SignedOut>
        <div className="mx-auto flex mt-10 items-center flex-col gap-3">
          <p className="text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px]">
            Please login or signup to continue
          </p>
        </div>
      </SignedOut>
    </>
  );
}
