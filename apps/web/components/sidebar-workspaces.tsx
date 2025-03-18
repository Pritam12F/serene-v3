"use client";

import useStore from "@workspace/store";
import { useEffect, useRef } from "react";
import { Workspace } from "./workspace";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
} from "@workspace/ui/components/sidebar";
import useClickOutside from "@/hooks/use-on-click-outside";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";

export function SidebarWorkspaces() {
  const { mutator, changeMutator, activeWorkspaceId, changeActiveWorkspaceId } =
    useStore();
  const workspaceRef = useRef(null);
  const session = useSession();
  const user_id = session.data?.user.id ?? "";
  const { postTree, mutate } = useWorkspaces(user_id);
  const router = useRouter();

  useClickOutside(workspaceRef, () => {
    if (activeWorkspaceId) {
      changeActiveWorkspaceId(null);
    }
  });

  useEffect(() => {
    if (mutator) {
      return;
    }

    changeMutator(mutate);
  }, [mutate]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu ref={workspaceRef}>
          {postTree?.map((workspace, idx) => (
            <Workspace
              data={workspace}
              parentUrl={`/documents/${workspace!.id}`}
              key={idx}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      <Button
        className="my-2 p-0.5 h-5 w-11/12 mx-auto"
        variant={"ghost"}
        aria-label="Add new post"
        onClick={() => {
          router.push("/documents/newPost");
        }}
      >
        <Plus />
      </Button>
    </SidebarGroup>
  );
}
