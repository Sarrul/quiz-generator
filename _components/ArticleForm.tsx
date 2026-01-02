import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Sparkles } from "lucide-react";

type Props = {
  title: string;
  content: string;
  loading: boolean;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  onGenerate: () => void;
};

export function ArticleForm({
  title,
  content,
  loading,
  setTitle,
  setContent,
  onGenerate,
}: Props) {
  return (
    <div className="flex flex-col gap-5 h-fit rounded-lg border border-zinc-200 bg-white p-7 w-214 mx-auto mt-48">
      {/* title description */}
      <div className="gap-2 flex flex-col">
        <p className="text-[24px] font-semibold flex gap-2">
          <Sparkles /> Article Summary Generator
        </p>
        <p className="text-sm text-zinc-500">
          Paste your article below to generate a summarize and quiz question.
          Your articles will saved in the sidebar for future reference.
        </p>
      </div>

      {/* article title input */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold flex gap-1">
          <FileText size={14} /> Article title
        </p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your article..."
        />
      </div>

      {/* article content input */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold flex gap-1">
          <FileText size={14} /> Article content
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 rounded-md border p-2"
          placeholder="Paste your article content here..."
        />
      </div>

      {/* generate button */}
      <div className="flex justify-end">
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate summary"}
        </Button>
      </div>
    </div>
  );
}
