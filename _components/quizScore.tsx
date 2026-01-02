"use client";

import { Button } from "@/components/ui/button";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

type Props = {
  quiz: QuizQuestion[];
  answers: number[];
  onRestart: () => void;
  onLeave: () => void;
};

export function QuizScore({ quiz, answers, onRestart, onLeave }: Props) {
  const score = quiz.reduce((acc, q, index) => {
    return acc + (q.correctAnswerIndex === answers[index] ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 rounded-lg border bg-white">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Quiz Results</h2>
        <p className="text-zinc-600">
          You scored{" "}
          <span className="font-semibold">
            {score} / {quiz.length}
          </span>
        </p>
      </div>

      {/* Question review */}
      <div className="flex flex-col gap-6">
        {quiz.map((q, qIndex) => {
          const userAnswer = answers[qIndex];
          const isCorrect = userAnswer === q.correctAnswerIndex;

          return (
            <div key={qIndex} className="rounded-lg border p-4 bg-zinc-50">
              <p className="font-semibold mb-3">
                {qIndex + 1}. {q.question}
              </p>

              <div className="flex flex-col gap-2">
                {q.options.map((option, oIndex) => {
                  const isUserChoice = oIndex === userAnswer;
                  const isCorrectAnswer = oIndex === q.correctAnswerIndex;

                  let className = "px-3 py-2 rounded border text-sm";

                  if (isCorrectAnswer) {
                    className += " border-green-500 bg-green-50 text-green-700";
                  } else if (isUserChoice && !isCorrect) {
                    className += " border-red-500 bg-red-50 text-red-700";
                  } else {
                    className += " border-zinc-200";
                  }

                  return (
                    <div key={oIndex} className={className}>
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onRestart}>
          Restart quiz
        </Button>
        <Button onClick={onLeave}>Save & leave</Button>
      </div>
    </div>
  );
}
