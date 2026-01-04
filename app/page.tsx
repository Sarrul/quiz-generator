"use client";

import { ArticleForm } from "@/_components/ArticleForm";
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

  type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

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

  async function handleTakeQuiz() {
    const res = await fetch("/api/generateQuiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setQuiz(data.questions);
    setCurrentQuestion(0);
    setAnswers([]);
    setView("quiz");
  }

  async function handleSaveAndLeave() {
    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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

  const { selectedArticle } = useArticle();

  useEffect(() => {
    if (!selectedArticle) return;

    setTitle(selectedArticle.title);
    setContent(selectedArticle.content);
    setSummary(selectedArticle.summary ?? "");
    setView("summary");
  }, [selectedArticle]);

  return (
    <>
      <SignedIn>
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
              setSummary("");
              setView("form");
            }}
            handleTakeQuiz={handleTakeQuiz}
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
