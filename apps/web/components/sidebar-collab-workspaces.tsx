"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@workspace/ui/components/sidebar";
import { useCollabWorkspace } from "@/hooks/use-collab-workspaces";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Plus, UserRoundPlus } from "lucide-react";
import { NewWorkspace } from "./new-workspace-dialog";

export function SidebarCollaborativeWorkspaces() {
  const session = useSession();
  const [isHovering, setIsHovering] = useState(false);
  const { mainWorkspaces, secondaryWorkspaces } = useCollabWorkspace();
  const [IsNewDialogOpen, setIsNewDailogOpen] = useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={`flex justify-between items-center hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        Workspaces
        <SidebarMenuAction
          className={`my-2 p-0.5 h-5 mx-2 opacity-${isHovering ? "100" : "0"} transition-all duration-75`}
          aria-label="Add new post"
        >
          <div className="flex justify-center space-x-4">
            <Plus
              className="opacity-70 hover:opacity-100 transition-all duration-250 w-4 h-4"
              onClick={() => setIsNewDailogOpen(true)}
            />
            <UserRoundPlus className="opacity-70 hover:opacity-100 transition-all duration-250 w-4 h-4" />
          </div>
        </SidebarMenuAction>
      </SidebarGroupLabel>
      <SidebarGroupContent></SidebarGroupContent>
      <NewWorkspace isOpen={IsNewDialogOpen} setIsOpen={setIsNewDailogOpen} />
    </SidebarGroup>
  );
}
