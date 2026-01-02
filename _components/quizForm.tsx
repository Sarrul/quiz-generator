import { Button } from "@/components/ui/button";

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
    <div className="max-w-xl mx-auto mt-32 p-6 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-zinc-500">
          Question {questionIndex + 1} / {totalQuestions}
        </p>
        <button onClick={onCancel} className="text-zinc-400 text-xl">
          ✕
        </button>
      </div>

      <h2 className="font-semibold mb-4">{question.question}</h2>

      <div className="flex flex-col gap-2">
        {question.options.map((option, index) => (
          <Button key={index} variant="outline" onClick={() => onAnswer(index)}>
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
