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
    <Button
      variant={"link"}
      className="flex items-center justify-center absolute top-[162px] left-44 text-gray1-400 hover:no-underline opacity-50 hover:opacity-80 transition-all duration-500"
      onClick={() => {
        setIsPickerOpen(true);
      }}
    >
      <Smile height={18} className="" />
      <p className="font-medium">Change icon</p>
    </Button>
  );
}
