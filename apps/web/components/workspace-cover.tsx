import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { debounce } from "@/lib/debounce";
import { changePostNameById } from "@/server/actions";
import useStore from "@workspace/store";

export const WorkspaceCover = ({
  coverUrl,
  title,
  postId,
}: {
  coverUrl?: string;
  title: string;
  postId: number;
}) => {
  const { workspaceNames, setWorkspaceName } = useStore();

  const debouncedRenamePost = useMemo(
    () =>
      debounce(async (title: string, postId: number) => {
        await changePostNameById(postId, title ?? "Untitled");
      }),
    []
  );

  return (
    <div className="relative w-full h-[270px] min-h-[270px]">
      {coverUrl ? (
        <>
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute ml-12 mt-40 opacity-0 hover:opacity-100 z-50 duration-500 ut-button:bg-transparent text-slate-300 ut-button:hover:ring-0"
            content={{
              button: () => {
                return (
                  <div className="flex flex-row gap-x-1">
                    <ImageIcon height={18} className="mt-0.5" />
                    Change cover
                  </div>
                );
              },
              allowedContent: " ",
            }}
          />
          <Image
            src={coverUrl}
            alt="Example Image"
            fill
            className="object-cover absolute inset-0"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#454653] to-[#282b32]">
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute ml-8 mt-40 opacity-0 hover:opacity-100 z-50 duration-500 ut-button:bg-transparent text-slate-300 ut-button:hover:ring-0"
            content={{
              button: () => {
                return (
                  <div className="flex flex-row gap-x-1">
                    <ImageIcon height={18} className="mt-0.5" />
                    Add cover
                  </div>
                );
              },
              allowedContent: " ",
            }}
          />
        </div>
      )}
      <TextareaAutosize
        className="w-fit mx-14 absolute mt-48 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
        placeholder="Untitled"
        value={workspaceNames.get(postId)}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setWorkspaceName(postId, e.target.value);
          debouncedRenamePost(title, postId);
        }}
      />
    </div>
  );
};
