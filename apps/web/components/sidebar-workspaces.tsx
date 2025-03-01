"use client";

import useStore from "@workspace/store";
import { useEffect, useRef } from "react";
import { Workspace } from "./workspace";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@workspace/ui/components/sidebar";
import useClickOutside from "@/hooks/use-on-click-outside";
import { useWorkspaces } from "@/hooks/use-workspaces";

export function SidebarWorkspaces() {
  const { mutator, changeMutator, activeWorkspaceId, changeActiveWorkspaceId } =
    useStore();
  const workspaceRef = useRef(null);

  const user_id = user.user?.id ?? "";
  const { postTree, mutate } = useWorkspaces(user_id);

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
    </SidebarGroup>
  );
}
