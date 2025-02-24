import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";

export const WorkspaceCover = ({
  coverUrl,
  title,
}: {
  coverUrl?: string;
  title: string;
}) => {
  return (
    <div className="relative w-full h-[270px]">
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt="Example Image"
          fill
          className="object-cover absolute inset-0"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#454653] to-[#282b32]" />
      )}
      <TextareaAutosize
        className="w-fit mx-14 absolute pt-48 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
        placeholder="Untitled"
        value={title!}
      />
      <UploadButton
        className="absolute inset-0 ml-[1000px] mt-48"
        endpoint="imageUploader"
      />
    </div>
  );
};
