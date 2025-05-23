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
    <Button
      variant={"link"}
      className="flex items-center justify-center absolute top-[162px] left-36 md:left-44 text-slate-700 hover:no-underline opacity-70 hover:opacity-100 transition-all duration-500 mix-blend-difference"
      onClick={() => {
        setIsPickerOpen(true);
      }}
    >
      <Smile height={18} className="" />
      <p className="font-medium">Change icon</p>
    </Button>
  );
}
