import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { debounce } from "@/lib/debounce";
import {
  addOrUpdateCoverImage,
  changePostNameById,
  fetchSinglePostById,
} from "@/server/actions";
import useStore from "@workspace/store";
import { ClientUploadedFileData } from "uploadthing/types";

export const WorkspaceCover = ({ postId }: { postId: number }) => {
  const { workspaceNames, setWorkspaceName } = useStore();
  const [coverLink, setCoverLink] = useState<string | null>();

  const fetchCover = useCallback(async () => {
    const { success, data } = await fetchSinglePostById(postId);

    if (success) {
      setCoverLink(data?.coverImage?.url);
    }
  }, [postId]);

  useEffect(() => {
    fetchCover();
  }, []);

  const debouncedRenamePost = useMemo(
    () =>
      debounce(async (title: string, postId: number) => {
        await changePostNameById(postId, title ?? "Untitled");
      }),
    []
  );

  const handleOnUpload = async (file: ClientUploadedFileData<any>[]) => {
    const { success } = await addOrUpdateCoverImage(file[0]!.url, postId);

    if (success) {
      setCoverLink(file[0]?.url!);
    }
  };

  return (
    <div className="relative w-full h-[270px] min-h-[270px]">
      {coverLink ? (
        <>
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute ml-12 mt-40 opacity-30 hover:opacity-70 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 text-slate-300"
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
            onClientUploadComplete={handleOnUpload}
          />
          <Image
            src={coverLink}
            alt="Example Image"
            fill
            className="object-cover absolute inset-0"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#454653] to-[#282b32]">
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute ml-8 mt-40 opacity-30 hover:opacity-70 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 text-slate-300"
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
            onClientUploadComplete={handleOnUpload}
          />
        </div>
      )}
      <div>
        <TextareaAutosize
          className="w-fit mx-14 absolute mt-48 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
          placeholder="Untitled"
          value={workspaceNames.get(postId)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setWorkspaceName(postId, e.target.value);
            debouncedRenamePost(workspaceNames.get(postId), postId);
          }}
        />
      </div>
    </div>
  );
};
