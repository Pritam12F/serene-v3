"use client";

import {
  Breadcrumb,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import dynamic from "next/dynamic";
import Loading from "@/app/(main)/documents/[[...slug]]/loading";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { useWorkspace } from "@/hooks/use-workspaces";
import { usePathname } from "next/navigation";
import { Room } from "./room";

export const SidebarExtensionWorkspaces = () => {
  const Editor = dynamic(() => import("./workspace-editor"), {
    ssr: false,
  });
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const path = usePathname();

  const { mainWorkspaces, secondaryWorkspaces } = useWorkspace();
  const workspace =
    mainWorkspaces.find((x) => x?.id === path.split("/")[2]) ??
    secondaryWorkspaces.find((x) => x?.id === path.split("/")[2]);

  const workspaceName = workspace?.name;
  const editedAt = workspace?.updatedAt?.toDateString();

  return (
    <SidebarInset className="bg-white h-screen overflow-y-hidden dark:bg-gray-950">
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>{workspaceName}</BreadcrumbList>
          </Breadcrumb>
        </div>
        {editedAt && (
          <div className="mx-8 text-sm">Last edited on {editedAt}</div>
        )}
      </header>
      {!workspace && (
        <div className="h-screen w-full flex flex-col items-center">
          <div className="text-4xl my-48">No workspace selected...</div>
          <Link href={"/documents/newPost"}>
            <Button>Create new workspace</Button>
          </Link>
        </div>
      )}
      {workspace && (
        <Room>
          <Editor
            editable={true}
            workspaceId={workspace?.id}
            initialContent={workspace?.content}
            onReady={setIsEditorReady}
            isReady={isEditorReady}
            coverImage={workspace.coverImage?.url}
          />
        </Room>
      )}
      {(!isEditorReady || !workspace) && <Loading />}
    </SidebarInset>
  );
};
