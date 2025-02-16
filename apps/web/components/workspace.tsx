import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  SidebarInput,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { ChevronRight } from "lucide-react";
import { WorkspaceActions } from "./workspace-actions";
import { type SelectPostType } from "@workspace/common/types/db";
import Link from "next/link";
import useStore from "@workspace/store";
import { useEffect, useRef } from "react";

interface WorkspaceProps {
  isActive?: boolean;
  data: SelectPostType;
  level?: number;
}

export const Workspace = ({
  isActive = false,
  data,
  level = 0,
}: WorkspaceProps) => {
  const { activeRenameId, registerWorkspaceRefs } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerWorkspaceRefs(ref.current);
  }, []);

  return (
    <Collapsible id={data?.id as unknown as string} ref={ref}>
      {data?.id !== activeRenameId && data?.id !== undefined ? (
        <SidebarMenuItem style={{ marginLeft: `${level * 5}px` }}>
          <SidebarMenuButton asChild>
            <Link className="ml-7" href="#">
              {data?.emoji && <span>{data?.emoji}</span>}
              <span>{data?.name}</span>
            </Link>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction
              className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
              showOnHover
            >
              <ChevronRight />
            </SidebarMenuAction>
          </CollapsibleTrigger>
          <WorkspaceActions documentId={data!.id} />
          <CollapsibleContent>
            {data?.children &&
              data.children.map((post) => (
                <Workspace data={post} key={post?.id} level={level + 1} />
              ))}
          </CollapsibleContent>
        </SidebarMenuItem>
      ) : (
        <SidebarInput />
      )}
    </Collapsible>
  );
};
