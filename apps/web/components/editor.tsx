"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React from "react";
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
  title?: string | null;
  postId?: number | null;
}

const Editor = ({ editable, initialContent, title, postId }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const onEditorContentChange = async () => {};

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
      className={`overflow-x-hidden max-w-[1500px] flex flex-col gap-4 pb-5 ${resolvedTheme}-block-note`}
    >
      <WorkspaceCover postId={postId!} />
      <BlockNoteView
        editor={editor}
        onChange={() => {
          console.log(editor.document);
        }}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
