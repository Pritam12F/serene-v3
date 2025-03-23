"use client";

import { createNewPost } from "@/server";
import { store } from "@workspace/store";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PostDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
  const params = useSearchParams().get("parentId");
  const router = useRouter();
  const parentId = decodeURIComponent(params ?? "")
    .split("/")
    .at(-1);

  const getPostName = (id: string) => store.getState().getPostName(id);
  const getWorkspaceContent = (id: string) =>
    store.getState().getPostContent(id);

  const createPostHandler = async () => {
    const { success, message, data } = await createNewPost(
      getPostName("0") ?? "Untitled",
      getWorkspaceContent("0"),
      parentId === "0" ? undefined : parentId
    );

    if (success) {
      toast.success("Post created successfully!", {
        style: { backgroundColor: "#38b000" },
      });

      store.getState().setPostName("0", "");
      store.getState().setPostContent("0", {});
      router.push(
        decodeURIComponent(params ?? "/documents").concat(`/${data}`)
      );
      store.getState().mutator?.();
      return;
    }
    router.push(decodeURIComponent(params ?? "/documents"));
    toast.error("Error adding post", { style: { backgroundColor: "red" } });
    console.error(message);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={async (e) => {
        setIsDialogOpen(e);

        await createPostHandler();
      }}
    >
      <DialogContent className="w-5/6 h-5/6 dark:bg-gray-950 rounded-md">
        <Editor
          editable={true}
          onReady={setIsEditorReady}
          isReady={isEditorReady}
          type="new"
        />
      </DialogContent>
    </Dialog>
  );
}
