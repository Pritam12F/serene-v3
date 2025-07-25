import { addOrUpdatePostEmoji } from "@/server";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Button } from "@workspace/ui/components/button";
import { Smile } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function EmojiPicker({
  isPickerOpen,
  setIsPickerOpen,
  postId,
  setChangeEmoji,
}: {
  isPickerOpen: boolean;
  setIsPickerOpen: Dispatch<SetStateAction<boolean>>;
  postId: string;
  setChangeEmoji: Dispatch<SetStateAction<string | null | undefined>>;
}) {
  const [lastSelectedEmoji, setLastSelectedEmoji] = useState<string | null>();

  const handleUpdateEmoji = async () => {
    try {
      if (!lastSelectedEmoji) {
        toast.info("No emoji was selected", {
          style: { backgroundColor: "yellow", color: "black" },
        });

        return;
      }

      const { success } = await addOrUpdatePostEmoji(
        postId,
        lastSelectedEmoji ?? ""
      );

      if (success) {
        toast.info(`Emoji updated to ${lastSelectedEmoji}`, {
          style: { backgroundColor: "yellow", color: "black" },
        });

        setChangeEmoji(lastSelectedEmoji);
      } else {
        toast.error("Could not update emoji", {
          style: {
            backgroundColor: "red",
          },
        });
      }
    } catch {
      toast.error("Some error occured updating emoji", {
        style: { backgroundColor: "red" },
      });
    }
  };

  return isPickerOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-[99999] bg-black/10">
      <div className="rounded-lg shadow-lg">
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => {
            setLastSelectedEmoji(emoji.native);
          }}
          onClickOutside={async () => {
            setIsPickerOpen(false);
            await handleUpdateEmoji();
          }}
        />
      </div>
    </div>
  ) : (
    <button
      className="flex translate-y-[0.8x] items-center space-x-1 justify-center absolute top-[164px] left-40 md:left-44 hover:no-underline opacity-50 hover:opacity-80 h-[31.5px] transition-all text-black bg-gray-200 hover:bg-gray-200 dark:hover:text-black px-[7px] pt-[6.9px] pb-[5px] rounded-lg duration-300"
      onClick={() => {
        setIsPickerOpen(true);
      }}
    >
      <Smile height={18} className="" />
      <p className="font-normal text-[14px]">Change icon</p>
    </button>
  );
}
