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
  data: {
    id: number;
    name: string | null;
    content: unknown;
    emoji: string | null;
    userId: string;
    parentId: number | null;
    createdAt: Date | null;
    parent: {
      id: number;
      name: string | null;
      content: unknown;
      emoji: string | null;
      userId: string;
      parentId: number | null;
      createdAt: Date | null;
    } | null;
    children: {
      id: number;
      name: string | null;
      content: unknown;
      emoji: string | null;
      userId: string;
      parentId: number | null;
      createdAt: Date | null;
    }[];
  };
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
        <WorkspaceActions documentId={data?.id} />
        <CollapsibleContent>
          {data?.children && <Workspace data={data} />}
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

// export const SubWorkspace = ({ isActive = false, data }: WorkspaceProps) => {
//   return (
//     <SidebarMenuSub>
//       {data?.map((page) => (
//         <SidebarMenuSubItem key={page.name}>
//           <SidebarMenuSubButton asChild>
//             <a href="#">
//               <span>{page.emoji}</span>
//               <span>{page.name}</span>
//             </a>
//           </SidebarMenuSubButton>
//         </SidebarMenuSubItem>
//       ))}
//     </SidebarMenuSub>
//   );
// };
