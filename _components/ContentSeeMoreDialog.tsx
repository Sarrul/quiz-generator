import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  content: string;
  title?: string;
  trigger: React.ReactNode;
};

export function ContentSeeMoreDialog({ content, title, trigger }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="w-157 rounded-lg p-7">
        {title && (
          <DialogHeader>
            <DialogTitle className="text-black font-inter text-2xl font-semibold leading-8 tracking-[-0.6px]">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}

        <div className="whitespace-pre-line text-black font-inter text-sm font-normal leading-5 overflow-y-auto">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
