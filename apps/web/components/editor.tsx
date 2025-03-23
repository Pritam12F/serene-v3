"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import { uploadFiles } from "@/lib/uploadthing";
import { blueTheme } from "@/lib/themes";
import { WorkspaceCover } from "./cover";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@workspace/ui/lib/utils";
import useStore from "@workspace/store";
import { updatePostContent } from "@/server";

interface EditorProps {
  editable: boolean;
  initialContent?: unknown;
  postId?: number | null;
  onReady?: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  styles?: string;
  type?: "new" | "existing";
}

const Editor = ({
  editable,
  initialContent,
  postId,
  isReady,
  onReady,
  styles,
  type = "existing",
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const [currentContent, setCurrentContent] = useState<any>();
  const { setPostContent } = useStore();

  const debouncedCallback = useDebounce(async () => {
    await updatePostContent(postId!, currentContent);
  }, 5000);

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

  useEffect(() => {
    onReady?.(true);
  }, [editor.document]);

  useEffect(() => {
    debouncedCallback();
  }, [currentContent]);

  return (
    <div
      className={cn(
        `${!isReady ? "hidden" : "block"} overflow-x-hidden max-w-[1500px] h-full flex flex-col gap-4 pb-5 ${resolvedTheme}-block-note`,
        styles
      )}
    >
      <WorkspaceCover postId={postId!} type={type} isEditorReady={isReady} />
      <BlockNoteView
        editor={editor}
        onChange={async () => {
          if (type === "new") {
            setPostContent(0, editor.document);
            return;
          }
          setCurrentContent(editor.document);
        }}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
