import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

type Props = {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  onCancel: () => void;
};

export function QuizView({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onCancel,
}: Props) {
  return (
    <div className="flex flex-col gap-5 h-fit max-w-xl  p-7 w-214 mx-auto mt-48">
      <div className="flex justify-between items-center mb-4">
        <div className="gap-2 flex flex-col">
          <p className="text-[24px] font-semibold flex gap-2">
            <Sparkles /> Quick test
          </p>
          <p className="text-sm text-zinc-500">
            Take a quick test about your knowledge from your content ce.
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          ✕
        </Button>
      </div>
      <div className="max-w-xl  p-6 border rounded-lg bg-white h-fit ">
        <p className="text-sm text-zinc-500">
          Question {questionIndex + 1} / {totalQuestions}
        </p>

        <h2 className="font-semibold mb-4">{question.question}</h2>

        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onAnswer(index)}
              className="h-auto whitespace-normal text-center wrap-break-word"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
