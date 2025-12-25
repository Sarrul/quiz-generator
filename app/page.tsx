import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { FileText, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <SignedIn>
        <div className="flex flex-col gap-5 self-stretch rounded-lg border border-zinc-200 bg-white p-7 h-[442px] w-[856px] mx-auto mt-48">
          {/* title description */}
          <div className="gap-2 flex flex-col">
            <p className="text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px] flex text-center gap-2">
              <Sparkles />
              Article Quiz Generator
            </p>
            <p className="text-[#71717A] font-inter text-[16px] font-normal leading-[1.2]">
              Paste your article below to generate a summarize and quiz
              question. Your articles will saved in the sidebar for future
              reference.
            </p>
          </div>

          {/* article title input */}
          <div className="gap-1 flex flex-col">
            <p className="text-[#71717A] font-inter text-[14px] font-semibold leading-5 flex gap-1">
              <FileText width={15} height={15} />
              Article title
            </p>
            <Input placeholder="Enter a title for your article..." />
          </div>

          {/* article content input */}
          <div className="gap-1 flex flex-col">
            <p className="text-[#71717A] font-inter text-[14px] font-semibold leading-5 flex gap-1">
              <FileText width={15} height={15} />
              Article content
            </p>
            <textarea
              className="flex h-[120px] p-[8px_12px] items-start self-stretch rounded-[6px] border border-[#E4E4E7] bg-white"
              placeholder="Paste your article content here..."
            />
          </div>

          {/* generate button */}
          <div className="w-full flex justify-end">
            <Button className="w-fit">Generate summary</Button>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="mx-auto flex justify-center items-center flex-col gap-3">
          <p className="text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px]">
            Please login or signup to continue
          </p>
          <div className="flex gap-4">
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign up</Button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
