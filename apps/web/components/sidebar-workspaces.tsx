"use client";

import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import db from "@workspace/db";
import { posts, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import useStore from "@workspace/store";
import { useCallback, useEffect, useMemo } from "react";
import { Workspace } from "./workspace";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@workspace/ui/components/sidebar";
import { type SelectPostType } from "@workspace/common";

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
        where: eq(posts.userId, "6c742cc4-6266-4761-adcb-15e21e2e4e6f"),
        with: { children: true, parent: true },
      });

      return postsFetched;
    } catch (err) {
      console.error(err);
    }
  });
  const arrangePosts = useCallback((data) => {}, [data]);
  const declutered = useMemo(() => {
    return 1;
  }, [data]);

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
