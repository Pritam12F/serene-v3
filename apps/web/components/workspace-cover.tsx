import { Button } from "@workspace/ui/components/button";
import { ImageIcon } from "lucide-react";
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
        <>
          <Button
            variant="link"
            className="absolute ml-10 mt-40 opacity-0 hover:opacity-100 z-50 transition-all ease-in-out duration-300"
          >
            <ImageIcon />
            Change cover
          </Button>
          <Image
            src={coverUrl}
            alt="Example Image"
            fill
            className="object-cover absolute inset-0"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#454653] to-[#282b32]">
          <Button
            variant={"link"}
            className="ml-10 mt-36 opacity-0 hover:opacity-100 transition-all ease-in-out duration-300"
          >
            <ImageIcon />
            Add cover
          </Button>
        </div>
      )}
      <TextareaAutosize
        className="w-fit mx-14 absolute mt-48 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
        placeholder="Untitled"
        value={title!}
      />
    </div>
  );
};
