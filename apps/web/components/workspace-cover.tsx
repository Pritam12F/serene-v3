import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ClientUploadedFileData } from "uploadthing/types";
import {
  addOrUpdateWorkspaceCoverImage,
  fetchSingleWorkspace,
} from "@/server/workspace";
import { WorkspaceEmojiPicker } from "./workspace-emoji-picker";

export const WorkspaceCover = ({
  workspaceId,
  isEditorReady,
  coverImage,
}: {
  workspaceId: string;
  isEditorReady: boolean;
  coverImage?: string;
}) => {
  const [coverLink, setCoverLink] = useState<string | null>(coverImage ?? "");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string | null>();

  const fetchCover = useCallback(async () => {
    const { success, data } = await fetchSingleWorkspace(workspaceId.trim());

    if (success) {
      setCoverLink(data?.coverImage?.url!);
      setEmoji(data?.emoji!);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchCover();
  }, []);

  const handleOnUpload = async (file: ClientUploadedFileData<any>[]) => {
    const { success } = await addOrUpdateWorkspaceCoverImage(
      file[0]!.ufsUrl,
      workspaceId
    );

    if (success) {
      setCoverLink(file[0]?.ufsUrl!);
    }
  };

  if (!isEditorReady) {
    return null;
  }

  return (
    <div className="relative w-full h-[270px] min-h-[270px]">
      {coverLink ? (
        <>
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute ml-12 mt-40 text-[14px] opacity-50 hover:opacity-80 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 text-slate-gray1-400"
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
            unoptimized
            priority
          />
          <div className="text-8xl absolute left-14 top-16">{emoji}</div>
          <WorkspaceEmojiPicker
            isPickerOpen={isEmojiPickerOpen}
            setIsPickerOpen={setIsEmojiPickerOpen}
            workspaceId={workspaceId}
            setChangeEmoji={setEmoji}
          />
        </>
      ) : (
        <div className="absolute inset-0 dark:bg-gray-950">
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
          onChange={() => {}}
        />
      </div>
    </div>
  );
};
