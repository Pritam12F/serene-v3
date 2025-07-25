import { addOrUpdateWorkspaceEmoji } from "@/server/workspace";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Button } from "@workspace/ui/components/button";
import { Smile } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { MessageType } from "@workspace/common/types/ws";

export function WorkspaceEmojiPicker({
  isPickerOpen,
  setIsPickerOpen,
  workspaceId,
  setChangeEmoji,
  ws,
}: {
  isPickerOpen: boolean;
  setIsPickerOpen: Dispatch<SetStateAction<boolean>>;
  workspaceId: string;
  setChangeEmoji: Dispatch<SetStateAction<string | null | undefined>>;
  ws?: WebSocket;
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

      const { success } = await addOrUpdateWorkspaceEmoji(
        workspaceId,
        lastSelectedEmoji ?? ""
      );

      if (success) {
        toast.info(`Emoji updated to ${lastSelectedEmoji}`, {
          style: { backgroundColor: "yellow", color: "black" },
        });

        ws?.send(
          JSON.stringify({
            type: "UPDATE_EMOJI",
            payload: {
              emoji: lastSelectedEmoji,
              workspaceId,
            },
          })
        );

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
      className="flex items-center space-x-1 justify-center absolute top-[164px] -translate-y-[0.5px] left-44 hover:no-underline opacity-50 hover:opacity-80 h-7.5 transition-all text-black bg-gray-200 hover:bg-gray-200 dark:hover:text-black px-[7px] pt-[6.9px] pb-[5px] rounded-lg duration-300"
      onClick={() => {
        setIsPickerOpen(true);
      }}
    >
      <Smile height={18} className="mt-[0.5px]" />
      <p className="font-normal text-[13px]">Change icon</p>
    </button>
  );
}
