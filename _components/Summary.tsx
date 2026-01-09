import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

type Props = {
  summary: string;
  onBack: () => void;
  title: string;
  handleTakeQuiz: () => void;
  isLoading: boolean;
};

export function SummaryView({
  title,
  summary,
  onBack,
  handleTakeQuiz,
  isLoading,
}: Props) {
  return (
    <div className="flex flex-col mx-auto gap-6  mt-48">
      <Button variant="outline" onClick={onBack} className="w-fit">
        <ArrowLeft size={16} />
      </Button>

      <div className="flex flex-col gap-5 h-fit rounded-lg border border-zinc-200 bg-white p-7 w-214  ">
        {/* title description */}
        <p className="text-[24px] font-semibold text-center flex gap-2">
          <Sparkles /> Article Summary Generator
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-500 flex flex-row gap-2 ">
            <BookOpen width={16} height={16} />
            Summarized content
          </p>
          <p className="text-[24px] font-semibold ">{title}</p>
          <p className="text-sm text-zinc-700 whitespace-pre-line">{summary}</p>
        </div>

        {/* generate button */}
        <div className="flex justify-end" onClick={handleTakeQuiz}>
          <Button>{isLoading ? "Preparing quiz..." : "Take a quiz"}</Button>
        </div>
      </div>
    </div>
  );
}
