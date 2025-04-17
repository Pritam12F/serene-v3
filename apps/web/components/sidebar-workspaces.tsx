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
import {
  ArrowUpRight,
  LinkIcon,
  MoreHorizontal,
  Plus,
  StarOff,
} from "lucide-react";
import { NewWorkspace } from "./create-workspace";
import { JoinWorkspace } from "./join-workspace";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { toast } from "sonner";

export function SidebarWorkspaces() {
  const [isHovering, setIsHovering] = useState(false);
  const { mainWorkspaces, secondaryWorkspaces, mutator } = useWorkspace();
  const [IsNewDialogOpen, setIsNewDailogOpen] = useState(false);
  const isMobile = useIsMobile();

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <StarOff className="text-orange-500 dark:text-orange-300" />
                        <span>Add to Favorites</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async (e) => {
                          e.preventDefault();

                          await navigator.clipboard.writeText(
                            `${window.origin}/workspaces/${x?.id}`
                          );

                          toast("Copied link!");
                        }}
                      >
                        <LinkIcon className="text-muted-foreground" />
                        <span>Copy Link</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(
                            `/workspaces/${x?.id}`,
                            "_blank",
                            "noopener"
                          );
                        }}
                        className="cursor-pointer"
                      >
                        <ArrowUpRight className="text-muted-foreground" />
                        <span>Open in New Tab</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
