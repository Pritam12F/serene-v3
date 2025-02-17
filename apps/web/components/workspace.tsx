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
import { useRef } from "react";
import { Input } from "@workspace/ui/components/input";

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
  const { activeRenameId } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Collapsible id={data?.id as unknown as string} ref={ref}>
      {data?.id !== activeRenameId && data?.id !== undefined ? (
        <SidebarMenuItem style={{ marginLeft: `${level * 5}px` }}>
          <SidebarMenuButton className="hover:bg-transparent" asChild>
            <Link className="ml-7" href={"#"}>
              {data.emoji ? <span>{data.emoji}</span> : <span>📝</span>}
              <span>{data?.name}</span>
            </Link>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction
              className="left-2 bg-transparent text-sidebar-accent-foreground data-[state=open]:rotate-90 hover:bg-transparent"
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
        <Input
          className="scale-85 h-10 border-none border-gray-500 focus:border-none focus:outline-none focus:ring-0 shadow-[0_0_15px_10px] shadow-blue-500/50"
          placeholder="Rename..."
        />
      )}
    </Collapsible>
  );
};
