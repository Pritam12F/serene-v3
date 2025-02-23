"use client";

import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
} from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import { uploadFiles } from "@/lib/uploadthing";

interface EditorProps {
  onChange?: () => void;
  editable: boolean;
  initialContent?: unknown;
  title?: string | null;
}

const lightBlueTheme = {
  colors: {
    editor: {
      text: "#222222",
      background: "white",
    },
    menu: {
      text: "#ffffff",
      background: "#1c3a5f",
    },
    tooltip: {
      text: "#ffffff",
      background: "#264b77",
    },
    hovered: {
      text: "#ffffff",
      background: "#264b77",
    },
    selected: {
      text: "#ffffff",
      background: "#2d5b92",
    },
    disabled: {
      text: "#1c3a5f",
      background: "#14273f",
    },
    shadow: "#0d1c2f",
    border: "#1c3a5f",
    sideMenu: "#bababa",
    highlights: lightDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;

const darkBlueTheme = {
  ...lightBlueTheme,
  colors: {
    ...lightBlueTheme.colors,
    editor: {
      text: "#ffffff",
      background: "#282b32",
    },
    sideMenu: "#ffffff",
    highlights: darkDefaultTheme.colors!.highlights,
  },
} satisfies Theme;

const blueTheme = {
  light: lightBlueTheme,
  dark: darkBlueTheme,
};

const Editor = ({ onChange, editable, initialContent, title }: EditorProps) => {
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

  return (
    <div className="overflow-x-scroll max-w-[1500px] flex flex-col gap-4 px-3 py-10">
      <TextareaAutosize
        className="w-full mx-14 appearance-none focus:outline-none overflow-hidden font-semibold resize-none bg-transparent text-5xl"
        placeholder="Untitled"
        value={title!}
      />
      <BlockNoteView
        editor={editor}
        onChange={onChange}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
