"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { UploadButton, uploadFiles } from "@/lib/uploadthing";
import { BlockNoteEditor } from "@blocknote/core";

interface EditorProps {
  onChange?: () => void;
  editable: boolean;
  initialContent?: unknown;
  title?: string | null;
}

const Editor = ({ onChange, editable, initialContent, title }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent as unknown as any,
    uploadFile: async (file: File) => {
      const [res] = await uploadFiles("imageUploader", { files: [file] });

      return res?.url!;
    },
  });

  return (
    <div className="overflow-x-hidden max-w-[1500px] flex flex-1 flex-col gap-4 px-4 py-10">
      <TextareaAutosize
        className="w-full mx-12 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
        placeholder="Untitled"
        value={title!}
      />
      <BlockNoteView
        editor={editor}
        onChange={onChange}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
