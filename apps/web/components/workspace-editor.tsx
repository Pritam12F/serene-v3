"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import { uploadFiles } from "@/lib/uploadthing";
import { blueTheme } from "@/lib/themes";
import { cn } from "@workspace/ui/lib/utils";
import { WorkspaceCover } from "./workspace-cover";

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
  initialContent,
  updatedContent,
  workspaceId,
  isReady,
  onReady,
  styles,
  coverImage,
  socket,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const uploadFile = async (file: File) => {
    switch (true) {
      case file.type.startsWith("image"):
        const [res] = await uploadFiles("imageUploader", { files: [file] });
        return res?.url!;

      case file.type.startsWith("video"): {
        const [res] = await uploadFiles("videoUploader", { files: [file] });
        return res?.url!;
      }

      case file.type.startsWith("audio"): {
        const [res] = await uploadFiles("audioUploader", { files: [file] });
        return res?.url!;
      }

      default: {
        const [res] = await uploadFiles("otherTypeUploader", {
          files: [file],
        });
        return res?.url!;
      }
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent as unknown as any,
    uploadFile,
  });

  const onChangeHandler = () => {
    socket?.send(
      JSON.stringify({
        type: "updateContent",
        payload: {
          workspaceId,
          content: editor.document,
        },
      })
    );
  };

  useEffect(() => {
    onReady?.(true);
  }, [editor.document]);

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
        onChange={onChangeHandler}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
