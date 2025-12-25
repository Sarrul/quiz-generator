import Image from "next/image";

export function Header() {
  return (
    <div className="w-full h-14 flex justify-between items-center p-[8px_24px] border-b bg-white border-b-[#E4E4E7] z-50 sticky top-0">
      <p className="text-black font-gip text-[24px] font-semibold leading-normal tracking-[-0.528px]">
        Quiz app
      </p>
      <Image src="/avatar.png" alt="Avatar" width={40} height={40} />
    </div>
  );
}
