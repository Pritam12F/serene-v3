import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  addOrUpdateCoverImage,
  changePostNameById,
  fetchAllPublicPosts,
  fetchSinglePostById,
} from "@/server";
import useStore from "@workspace/store";
import { ClientUploadedFileData } from "uploadthing/types";
import { EmojiPicker } from "./emoji-picker";
import useDebounce from "@/hooks/use-debounce";
import Loading from "./loading";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

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
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const [isSharedPost, setIsSharedPost] = useState(false);

  const fetchCover = useCallback(async () => {
    const { success, data } = await fetchSinglePostById(postId);
    const { data: data2 } = await fetchAllPublicPosts();
    const sharedPost = data2?.filter((x) => x?.id === postId)[0];

    if (success) {
      setCoverLink(data?.coverImage?.url!);
      setEmoji(data?.emoji);
      if (!postNames.get(postId)) {
        postNames.set(postId, data?.name!);
      }

      return;
    }
    setCoverLink(sharedPost?.coverImage?.url!);
    setIsSharedPost(true);
    setEmoji(sharedPost?.emoji);
    postNames.set(postId, sharedPost?.name!);
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
    const { success } = await addOrUpdateCoverImage(file[0]!.ufsUrl, postId);

    if (success) {
      setCoverLink(file[0]?.ufsUrl!);
    }

    setIsLoading(false);
  };

  if (!isEditorReady || isLoading) {
    return <Loading height="h-[270px]" />;
  }

  return (
    <div className="relative w-full h-[270px] min-h-[270px] space-y-3">
      {type !== "new" &&
        (coverLink ? (
          <div>
            {!isSharedPost && (
              <UploadButton
                endpoint="coverImageUploader"
                className="absolute left-5 md:left-11 mt-40 text-[14px] opacity-50 hover:opacity-80 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0"
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
            )}
            <div>
              <Image
                src={coverLink}
                alt="Example Image"
                fill
                className="object-cover absolute inset-0"
                unoptimized
                priority
                id="cover"
              />
            </div>
            <div className="text-8xl absolute left-7 md:left-14 top-16">
              {emoji}
            </div>
            {!isSharedPost && (
              <EmojiPicker
                isPickerOpen={isEmojiPickerOpen}
                setIsPickerOpen={setIsEmojiPickerOpen}
                postId={postId}
                setChangeEmoji={setEmoji}
              />
            )}
          </div>
        ) : (
          <>
            {!isSharedPost && (
              <div className="absolute inset-0 dark:bg-gray-950">
                <UploadButton
                  endpoint="coverImageUploader"
                  className="absolute left-9 md:left-3 mb-10 md:ml-7 mt-40 opacity-30 hover:opacity-70 z-50 duration-500 ut-button:bg-transparent ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0"
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
          </>
        ))}
      <div className="w-full">
        <TextareaAutosize
          className="w-full mx-8 md:mx-14 absolute mt-48 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl text-left block mix-blend-luminosity"
          placeholder="Untitled"
          value={
            isMobile
              ? postNames.get(postId)?.substring(0, 11).concat("...")
              : postNames.get(postId)
          }
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (type === "new") {
              setPostName("0", e.target.value);
              return;
            }
            setPostName(postId, e.target.value);
            debouncedRenamePost(postId, e.target.value);
          }}
        />
      </div>
    </div>
  );
};
