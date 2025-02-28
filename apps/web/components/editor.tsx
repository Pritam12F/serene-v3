"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React, { Dispatch, SetStateAction, Suspense, useEffect } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import { uploadFiles } from "@/lib/uploadthing";
import { blueTheme } from "@/lib/themes";
import { WorkspaceCover } from "./workspace-cover";

interface EditorProps {
  editable: boolean;
  initialContent?: unknown;
  postId?: number | null;
  onReady: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
}

const Editor = ({
  editable,
  initialContent,
  postId,
  isReady,
  onReady,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div
      className={`${!isReady ? "hidden" : "block"} overflow-x-hidden max-w-[1500px] flex flex-col gap-4 pb-5 ${resolvedTheme}-block-note`}
    >
      <WorkspaceCover postId={postId!} />
      <BlockNoteView
        editor={editor}
        onChange={() => {}}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
