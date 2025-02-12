import { type SelectPostType } from "@workspace/common";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { ChevronRight } from "lucide-react";
import { WorkspaceActions } from "./workspace-actions";

interface WorkspaceProps {
  isActive?: boolean;
  data: SelectPostType;
}

export const Workspace = ({ isActive = false, data }: WorkspaceProps) => {
  return (
    <Collapsible key={data.name}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="#">
            <span>{data.emoji}</span>
            <span>{data.name}</span>
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
        <WorkspaceActions documentId={data.id} />
        <CollapsibleContent></CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
