"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import { uploadFiles } from "@/lib/uploadthing";
import { blueTheme } from "@/lib/themes";
import { WorkspaceCover } from "./workspace-cover";
import { updatePostContent } from "@/server/actions";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@workspace/ui/lib/utils";

interface EditorProps {
  editable: boolean;
  initialContent?: unknown;
  postId?: number | null;
  onReady?: Dispatch<SetStateAction<boolean>>;
  isReady?: boolean;
  styles?: string;
}

const Editor = ({
  editable,
  initialContent,
  postId,
  isReady,
  onReady,
  styles,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const [currentContent, setCurrentContent] = useState<any>();
  const postContent = createContext(currentContent);

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
    if (editor.document.length > 1) {
      onReady?.(true);
    }
  }, [editor.document]);

  useEffect(() => {
    debouncedCallback();
  }, [currentContent]);

  return (
    <div
      className={cn(
        `${!isReady ? "hidden" : "block"} overflow-x-hidden max-w-[1500px] flex flex-col gap-4 pb-5 ${resolvedTheme}-block-note`,
        styles
      )}
    >
      <WorkspaceCover postId={postId!} />
      <BlockNoteView
        editor={editor}
        onChange={async () => {
          setCurrentContent(editor.document);
        }}
        editable={editable}
        theme={resolvedTheme === "dark" ? blueTheme.dark : blueTheme.light}
      />
    </div>
  );
};

export default Editor;
