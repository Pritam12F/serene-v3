"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import db from "@workspace/db";
import { posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { SidebarActions } from "./sidebar-actions";
import { WorkspaceProvider } from "./workspace-context";

export function NavWorkspaces() {
  const user = useUser();
  const user_id = user.user?.id ?? "";
  const { data, mutate } = useSWR(`${user_id}/workspaces`, async () => {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.clerkId, user_id),
    });

    try {
      const postsFetched = await db.query.posts.findMany({
        where: eq(posts.userId, userFetched?.id ?? ""),
        with: { children: true, parent: true },
      });

      return postsFetched;
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <WorkspaceProvider mutate={mutate}>
      <SidebarGroup>
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {data?.map((workspace) => (
              <Collapsible key={workspace.name}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <span>{workspace.emoji}</span>
                      <span>{workspace.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                      showOnHover
                    >
                      <ChevronRight />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <SidebarActions documentId={workspace.id} />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {workspace.children.map((page) => (
                        <SidebarMenuSubItem key={page.name}>
                          <SidebarMenuSubButton asChild>
                            <a href="#">
                              <span>{page.emoji}</span>
                              <span>{page.name}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </WorkspaceProvider>
  );
}
