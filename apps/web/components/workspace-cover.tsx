import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ClientUploadedFileData } from "uploadthing/types";
import {
  addOrUpdateWorkspaceCoverImage,
  addOrUpdateWorkspaceName,
  fetchSingleWorkspace,
} from "@/server/workspace";
import { WorkspaceEmojiPicker } from "./workspace-emoji-picker";
import { useWebsocket } from "@/hooks/use-websocket";
import useDebounce from "@/hooks/use-debounce";
import { MessageType } from "@workspace/common/types/ws";
import Loading from "./loading";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export const WorkspaceCover = ({
  workspaceId,
  isEditorReady,
}: {
  workspaceId: string;
  isEditorReady: boolean;
  coverImage?: string;
}) => {
  const [coverLink, setCoverLink] = useState<string | null>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string | null>();
  const [name, setName] = useState("");
  const { ws, isReady } = useWebsocket(workspaceId, {
    setCoverLink,
    setEmoji,
    setName,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const fetchCover = useCallback(async () => {
    const { success, data } = await fetchSingleWorkspace(workspaceId?.trim());

    if (success) {
      setCoverLink(data?.coverImage?.url!);
      setEmoji(data?.emoji!);
      setName(data?.name!);
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
      ws?.send(
        JSON.stringify({
          type: MessageType.UPDATE_COVER,
          payload: {
            coverLink: file[0]?.ufsUrl!,
            workspaceId,
          },
        })
      );
    }

    setIsLoading(false);
  };

  const debouncedRenameWorkspace = useDebounce(
    async (workspaceId: string, newName: string) => {
      const { success } = await addOrUpdateWorkspaceName(newName, workspaceId);
      if (success) {
        ws?.send(
          JSON.stringify({
            type: MessageType.UPDATE_NAME,
            payload: {
              name: newName,
              workspaceId,
            },
          })
        );
      }
    }
  );

  useEffect(() => {
    debouncedRenameWorkspace(workspaceId, name);
  }, [name]);

  if (!isEditorReady || isLoading || !isReady) {
    return <Loading height="h-[270px]" />;
  }

  return (
    <div className="relative w-full space-y-3 h-[270px]">
      {coverLink ? (
        <div>
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute left-5 md:left-[39px] mt-40 text-[14px] opacity-50 hover:opacity-80 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 text-slate-gray1-400"
            content={{
              button: () => {
                return (
                  <div className="flex flex-row gap-x-1 text-black bg-gray-200 hover:bg-gray-200 dark:hover:text-black p-[5px] px-2 rounded-lg transition-all duration-300">
                    <ImageIcon height={18} className="mt-0.5" />
                    Add cover
                  </div>
                );
              },
              allowedContent: " ",
            }}
            onUploadBegin={() => setIsLoading(true)}
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
          <div className="text-8xl absolute left-8 md:left-[53px] lg:left-[58px] top-12">
            {emoji}
          </div>
          <WorkspaceEmojiPicker
            isPickerOpen={isEmojiPickerOpen}
            setIsPickerOpen={setIsEmojiPickerOpen}
            workspaceId={workspaceId}
            setChangeEmoji={setEmoji}
            ws={ws}
          />
        </div>
      ) : (
        <div className="absolute inset-0 dark:bg-gray-950">
          <UploadButton
            endpoint="coverImageUploader"
            className="absolute left-4 md:left-3 mb-10 md:ml-7 mt-40 opacity-30 hover:opacity-70 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 ut-allowed-content:hidden"
            content={{
              button: () => {
                return (
                  <div className="flex flex-row gap-x-1 text-sm text-black bg-gray-200 hover:bg-gray-200 dark:hover:text-black py-[6px] px-2 rounded-lg transition-all duration-300">
                    <ImageIcon height={18} className="mt-0.5" />
                    Add cover
                  </div>
                );
              },
              allowedContent: "",
            }}
            onUploadBegin={() => setIsLoading(true)}
            onClientUploadComplete={handleOnUpload}
          />
        </div>
      )}
      <div>
        <TextareaAutosize
          className="w-fit mx-8 md:mx-14 absolute mt-48 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
          placeholder="Untitled"
          value={isMobile ? name.substring(0, 8).concat("...") : name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
