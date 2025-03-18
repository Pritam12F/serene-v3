"use client";

import useStore from "@workspace/store";
import { useEffect, useRef, useState } from "react";
import { Workspace } from "./workspace";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
} from "@workspace/ui/components/sidebar";
import useClickOutside from "@/hooks/use-on-click-outside";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function SidebarWorkspaces() {
  const { mutator, changeMutator, activeWorkspaceId, changeActiveWorkspaceId } =
    useStore();
  const workspaceRef = useRef(null);
  const session = useSession();
  const user_id = session.data?.user.id ?? "";
  const { postTree, mutate } = useWorkspaces(user_id);
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

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
      <SidebarGroupLabel
        className={`flex justify-between items-center hover:bg-[#27272a]`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        Workspaces
        <SidebarMenuAction
          className={`my-2 p-0.5 h-5 mx-2 opacity-${isHovering ? "100" : "0"} transition-all duration-75`}
          aria-label="Add new post"
          onClick={() => {
            router.push("/documents/newPost");
          }}
        >
          <Plus />
        </SidebarMenuAction>
      </SidebarGroupLabel>
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
