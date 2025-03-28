"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useState } from "react";
import { Plus } from "lucide-react";
import { NewWorkspace } from "./create-workspace";
import { JoinWorkspace } from "./join-workspace";
import Link from "next/link";

export function SidebarWorkspaces() {
  const [isHovering, setIsHovering] = useState(false);
  const { mainWorkspaces, secondaryWorkspaces, mutator } = useWorkspace();
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
            <JoinWorkspace setHovering={setIsHovering} mutator={mutator} />
          </div>
        </SidebarMenuAction>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="max-h-36 overflow-y-scroll">
          {[...mainWorkspaces, ...secondaryWorkspaces].map((x) => {
            return (
              <Link href={`/workspaces/${x?.id}`} key={x?.id}>
                <SidebarMenuItem className="rounded-sm hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]">
                  <SidebarMenuButton className="px-9">
                    <span>{x?.emoji ?? "📓"}</span>
                    <span>{x?.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
      <NewWorkspace
        isOpen={IsNewDialogOpen}
        setIsOpen={setIsNewDailogOpen}
        mutator={mutator}
      />
    </SidebarGroup>
  );
}
