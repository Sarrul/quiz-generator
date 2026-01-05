import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, FileText, Sparkles } from "lucide-react";
import { ContentSeeMoreDialog } from "./ContentSeeMoreDialog";

type Props = {
  article: {
    id: string;
    title: string;
    content: string;
    summary: string | null;
  };
  onBack: () => void;
  onTakeQuiz: (articleId: string) => void;
  isLoading: boolean;
};

export function HistoryArticleForm({
  article,
  onBack,
  onTakeQuiz,
  isLoading,
}: Props) {
  return (
    <div className="flex flex-col mx-auto gap-6 mt-48">
      <Button variant="outline" onClick={onBack} className="w-fit">
        <ArrowLeft size={16} />
      </Button>

      <div className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-white p-7 w-214">
        <p className="text-[24px] font-semibold text-center flex gap-2">
          <Sparkles /> Article Quiz Generator
        </p>

        {/* Summary */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-500 flex gap-2">
            <BookOpen size={16} /> Summary
          </p>
          <p className="text-[24px] font-semibold">{article.title}</p>
          <p className="text-sm text-zinc-700 whitespace-pre-line">
            {article.summary}
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-500 flex gap-2">
            <FileText size={14} /> Article content
          </p>
          <p className="text-sm text-zinc-700 whitespace-pre-line line-clamp-3">
            {article.content}
          </p>
          <ContentSeeMoreDialog
            title={article.title}
            content={article.content}
            trigger={
              <div className="text-[#09090B] font-inter text-sm font-medium leading-5 w-full flex justify-end cursor-pointer">
                see more
              </div>
            }
          />
        </div>

        <div>
          <Button onClick={() => onTakeQuiz(article.id)} disabled={isLoading}>
            {isLoading ? "Preparing quiz..." : "Take a quiz"}
          </Button>
        </div>
      </div>
    </div>
  );
}
