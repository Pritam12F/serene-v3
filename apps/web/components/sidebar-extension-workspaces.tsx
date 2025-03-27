"use client";

import {
  Breadcrumb,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { useWorkspace } from "@/hooks/use-workspaces";
import { usePathname } from "next/navigation";
import { CollaborativeRoom } from "./room";
import Loading from "./loading";
import { client } from "@/lib/liveblocks";

export const SidebarExtensionWorkspaces = () => {
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const path = usePathname();

  const { mainWorkspaces, secondaryWorkspaces } = useWorkspace();
  const workspace =
    mainWorkspaces.find((x) => x?.id === path.split("/")[2]) ??
    secondaryWorkspaces.find((x) => x?.id === path.split("/")[2]);
  const room = client.getRoom(workspace?.id!);
  const userAccess = room?.getSelf();

  const workspaceName = workspace?.name;
  const editedAt = workspace?.updatedAt?.toDateString();

  useEffect(() => {
    if (!workspace) {
      setIsEditorReady(true);
    }
  }, [workspace]);

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
      {room && !userAccess && (
        <div className="h-screen w-full flex flex-col items-center">
          <div className="text-4xl my-48">
            You have not joined this workspace...
          </div>
          <div className="flex space-x-6">
            <Button>Join workspace</Button>
            <Button>Create new workspace</Button>
          </div>
        </div>
      )}
      {!workspace && !room && (
        <div className="h-screen w-full flex flex-col items-center">
          <div className="text-4xl my-48">Workspace doesn't exist...</div>
          <div className="flex space-x-6">
            <Button>Join workspace</Button>
            <Button>Create new workspace</Button>
          </div>
        </div>
      )}
      {workspace && (
        <CollaborativeRoom
          isReady={isEditorReady}
          onReadyAction={setIsEditorReady}
          roomId={workspace.id}
        />
      )}
      {!isEditorReady && <Loading />}
    </SidebarInset>
  );
};
