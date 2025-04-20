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
import { usePathname, useRouter } from "next/navigation";
import { CollaborativeRoom } from "./room";
import Loading from "./loading";
import { client } from "@/lib/liveblocks";
import NotFound from "./not-found";

export const SidebarExtensionWorkspaces = () => {
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const path = usePathname();
  const router = useRouter();

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
          <div className="hidden mx-5 font-medium text-sm text-muted-foreground md:inline-block">
            Edit {editedAt.split(" ")[2]} {editedAt.split(" ")[1]}
          </div>
        )}
      </header>
      {room && !userAccess && (
        <NotFound
          title="You don't have access to this workspace"
          status={404}
        />
      )}
      {!workspace && !room && (
        <NotFound title="Workspace doesn't exist" status={404} />
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
