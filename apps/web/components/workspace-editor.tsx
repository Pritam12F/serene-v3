"use client";

import { BlockNoteView } from "@blocknote/mantine";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { blueTheme } from "@/lib/themes";
import { cn } from "@workspace/ui/lib/utils";
import { WorkspaceCover } from "./workspace-cover";
import { useCreateBlockNoteWithLiveblocks } from "@liveblocks/react-blocknote";

interface EditorProps {
  editable: boolean;
  initialContent?: unknown;
  updatedContent?: unknown;
  workspaceId?: string | null;
  onReady?: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  styles?: string;
  socket?: WebSocket;
  coverImage?: string;
}

const Editor = ({
  editable,
  workspaceId,
  isReady,
  onReady,
  styles,
  coverImage,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNoteWithLiveblocks({});

  useEffect(() => {
    onReady?.(true);
  }, []);

  return (
    <div
      className={cn(
        `${!isReady ? "hidden" : "block"} overflow-x-hidden max-w-[1500px] h-full flex flex-col gap-4 pb-5 ${resolvedTheme}-block-note`,
        styles
      )}
    >
      <WorkspaceCover
        workspaceId={workspaceId!}
        isEditorReady={isReady}
        coverImage={coverImage}
      />
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
