"use client";

import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import db from "@workspace/db";
import { posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import useStore from "@workspace/store";
import { useEffect, useRef } from "react";
import { Workspace } from "./workspace";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@workspace/ui/components/sidebar";
import arrayToTree from "array-to-tree";
import useClickOutside from "@/hooks/use-on-click-outside";

export function SidebarWorkspaces() {
  const { mutator, changeMutator, activeRenameId, changeActiveRenameId } =
    useStore();
  const workspaceRef = useRef(null);

  const user = useUser();
  const user_id = user.user?.id ?? "";
  const { data, mutate } = useSWR(`${user_id}/workspaces`, async () => {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.clerkId, user_id),
    });

    try {
      const postsFetched = await db.query.posts.findMany({
        where: eq(posts.userId, "0e26a418-7451-49cc-af11-c1122355fc85"),
      });

      return arrayToTree(postsFetched, { parentProperty: "parentId" });
    } catch (err) {
      console.error(err);
    }
  });

  useClickOutside(workspaceRef, () => {
    if (activeRenameId) {
      changeActiveRenameId(null);
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
          {data?.map((workspace, idx) => (
            <Workspace data={workspace} key={idx} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
