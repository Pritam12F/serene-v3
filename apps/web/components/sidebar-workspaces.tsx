"use client";

import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
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
import { fetchAllPostsByUserId, fetchUserByClerkId } from "@/server/actions";

export function SidebarWorkspaces() {
  const { mutator, changeMutator, activeRenameId, changeActiveRenameId } =
    useStore();
  const workspaceRef = useRef(null);

  const user = useUser();
  const user_id = user.user?.id ?? "";
  const { data, mutate } = useSWR(`${user_id}/workspaces`, async () => {
    const fetchedUser = await fetchUserByClerkId(user_id);
    const fetchedPosts = await fetchAllPostsByUserId(fetchedUser.data!.id);

    if (fetchedUser.success && fetchedPosts.success && fetchedPosts.data) {
      return arrayToTree(fetchedPosts.data, { parentProperty: "parentId" });
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
