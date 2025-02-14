"use client";

import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import db from "@workspace/db";
import { posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import useStore from "@workspace/store";
import { useEffect, useState } from "react";
import { Workspace } from "./workspace";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@workspace/ui/components/sidebar";
import arrayToTree from "array-to-tree";

export function SidebarWorkspaces() {
  const { mutator, changeMutator } = useStore();

  const user = useUser();
  const user_id = user.user?.id ?? "";
  const { data, mutate } = useSWR(`${user_id}/workspaces`, async () => {
    const userFetched = await db.query.users.findFirst({
      where: eq(users.clerkId, user_id),
    });
    console.log(userFetched);

    try {
      const postsFetched = await db.query.posts.findMany({
        where: eq(posts.userId, userFetched!.id),
      });

      return arrayToTree(postsFetched, { parentProperty: "parentId" });
    } catch (err) {
      console.error(err);
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
        <SidebarMenu>
          {data?.map((workspace, idx) => (
            <Workspace data={workspace} key={idx} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
