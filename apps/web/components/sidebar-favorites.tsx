"use client";


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@workspace/ui/components/sidebar";
import { useCollabWorkspace } from "@/hooks/use-collab-workspaces";

export function SidebarCollaborativeWorkspaces() {
  

  const { mainWorkspaces, secondaryWorkspaces } = useCollabWorkspace();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {[...mainWorkspaces, ...secondaryWorkspaces].map((item) => ())}
      </SidebarMenu>
    </SidebarGroup>
  );
}
