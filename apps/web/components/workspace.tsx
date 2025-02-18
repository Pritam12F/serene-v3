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
      {/* Container for smooth transition */}
      <div
        className="relative h-8 transition-all"
        style={{ marginLeft: `${level * 5}px` }}
      >
        {/* Menu Item - always rendered but conditionally shown */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            data?.id === activeRenameId
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent" asChild>
              <Link className="ml-7" href={"#"}>
                {data?.emoji ? <span>{data.emoji}</span> : <span>📝</span>}
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
          </SidebarMenuItem>
        </div>

        {/* Input Field - always rendered but conditionally shown */}
        <div
          className={`flex justify-center absolute inset-0 transition-opacity duration-300 ${
            data?.id === activeRenameId
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Input
            className="h-8 w-11/12 border-none bg-background shadow-[0_0_15px_10px] shadow-blue-500/50 focus-visible:ring-0"
            placeholder="Rename..."
          />
        </div>
      </div>

      {/* Children content remains separate */}
      <CollapsibleContent>
        {data?.children &&
          data.children.map((post) => (
            <Workspace data={post} key={post?.id} level={level + 1} />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
