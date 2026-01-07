"use client";

import { ArticleForm } from "@/_components/ArticleForm";
import { HistoryArticleForm } from "@/_components/HistoryArticleForm";
import { QuizView } from "@/_components/quizForm";
import { QuizScore } from "@/_components/quizScore";
import { SummaryView } from "@/_components/Summary";
import { useArticle } from "@/_contexts/ArcticleContext";
import { useArticleFlow } from "@/hooks/useArticleFlow";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  const { selectedArticle, clearSelectedArticle } = useArticle();
  const {
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
    setTitle,
    setContent,
    setView,
    handleGenerate,
    handleTakeQuizById,
    handleTakeQuizFromSummary,
    handleSaveAndLeave,
    handleAnswer,
    handleCancelQuiz,
    handleRestartQuiz,
    handleLeaveQuiz,
  } = useArticleFlow();

  const isHistoryArticle = Boolean(selectedArticle);

  return (
    <>
      <SignedIn>
        {selectedArticle ? (
          <HistoryArticleForm
            article={selectedArticle}
            isLoading={isLoading}
            onBack={clearSelectedArticle}
            onTakeQuiz={(id) => handleTakeQuizById(id, clearSelectedArticle)}
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
                onBack={() => setView("form")}
                handleTakeQuiz={handleTakeQuizFromSummary}
                isLoading={isLoading}
              />
            )}

            {view === "quiz" && quiz.length > 0 && (
              <QuizView
                question={quiz[currentQuestion]}
                questionIndex={currentQuestion}
                totalQuestions={quiz.length}
                onAnswer={handleAnswer}
                onCancel={handleCancelQuiz}
              />
            )}

            {view === "score" && (
              <QuizScore
                quiz={quiz}
                quizSource={quizSource}
                answers={answers}
                isHistory={isHistoryArticle}
                onRestart={handleRestartQuiz}
                onLeave={handleLeaveQuiz}
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
