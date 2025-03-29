import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  addOrUpdateCoverImage,
  changePostNameById,
  fetchSinglePostById,
} from "@/server";
import useStore from "@workspace/store";
import { ClientUploadedFileData } from "uploadthing/types";
import { EmojiPicker } from "./emoji-picker";
import useDebounce from "@/hooks/use-debounce";

export const PostCover = ({
  postId,
  type,
  isEditorReady,
}: {
  postId: string;
  type: "existing" | "new" | "workspace";
  isEditorReady: boolean;
}) => {
  const { postNames, setPostName } = useStore();
  const [coverLink, setCoverLink] = useState<string | null>();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string | null>();

  const fetchCover = useCallback(async () => {
    const { success, data } = await fetchSinglePostById(postId);

    if (success) {
      setCoverLink(data?.coverImage?.url!);
      setEmoji(data?.emoji);
    }
    if (!postNames.get(postId)) {
      postNames.set(postId, data?.name!);
    }
  }, [postId]);

  useEffect(() => {
    fetchCover();
  }, []);

  const debouncedRenamePost = useDebounce(
    async (postId: string, newName: string) => {
      await changePostNameById(postId, newName);
    }
  );

  const handleOnUpload = async (file: ClientUploadedFileData<any>[]) => {
    console.log(file[0]?.ufsUrl);
    const { success } = await addOrUpdateCoverImage(file[0]!.ufsUrl, postId);
    console.log(success);

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
          <EmojiPicker
            isPickerOpen={isEmojiPickerOpen}
            setIsPickerOpen={setIsEmojiPickerOpen}
            postId={postId}
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
          value={postNames.get(postId)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (type === "new") {
              setPostName("0", e.target.value);
              return;
            }
            setPostName(postId, e.target.value);
            debouncedRenamePost(postId, postNames.get(postId)!);
          }}
        />
      </div>
    </div>
  );
};
