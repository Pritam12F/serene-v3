"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";

interface EditorProps {
  onChange?: () => void;
  editable: boolean;
  initialContent?: string;
}

const Editor = ({ onChange, editable }: EditorProps) => {
  const appTheme = useTheme();
  const currenTheme = appTheme.theme === "system" ? "system" : appTheme.theme;

  const editor = useCreateBlockNote();

  return (
    <div className="overflow-hidden max-w-[1500px] flex flex-1 flex-col gap-4 px-4 py-10">
      <TextareaAutosize
        className="w-full mx-12 appearance-none focus:outline-none overflow-hidden resize-none bg-transparent text-5xl"
        placeholder="Untitled"
      />
      <BlockNoteView
        editor={editor}
        onChange={onChange}
        editable={editable}
        theme={currenTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
