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
import { type SelectPostType } from "@workspace/common/types/db";
import Link from "next/link";
import useStore from "@workspace/store";
import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { Input } from "@workspace/ui/components/input";
import { changePostNameById } from "@/server";
import useDebounce from "@/hooks/use-debounce";
import { toast } from "sonner";

interface WorkspaceProps {
  data: SelectPostType;
  level?: number;
  parentUrl?: string;
}

export const Workspace = ({ data, level = 0, parentUrl }: WorkspaceProps) => {
  const {
    activeWorkspaceId,
    workspaceNames,
    mutator,
    changeActiveWorkspaceId,
    setWorkspaceName,
  } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  const debouncedRenamePost = useDebounce(
    async (postId: number, newName: string) => {
      await changePostNameById(postId, newName);
    },
    5000
  );

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(data!.id, e.target?.value ?? "Unknown");
    debouncedRenamePost(data!.id, e.target.value);
    data!.name = e.target.value;
  };

  const handleOnEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const res = await changePostNameById(
        data!.id,
        workspaceNames.get(data!.id)!
      );

      if (res.success) {
        toast.success("Post renamed successfully", {
          style: { backgroundColor: "#38b000" },
        });
      }
      data!.name = workspaceNames.get(data!.id) ?? "Unknown";
      mutator?.();
      changeActiveWorkspaceId(null);
    }
  };

  const currentPath = useMemo(() => {
    if (parentUrl) {
      if (parentUrl.includes(data!.id.toString())) {
        return parentUrl;
      }
      return `${parentUrl}/${data?.id}`;
    }
    return `/documents/${data?.id}`;
  }, [data?.id]);

  useEffect(() => {
    mutator?.();
    setWorkspaceName(data!.id, data?.name ?? "Untitled");
  }, [activeWorkspaceId]);

  return (
    <Collapsible id={data?.id as unknown as string} ref={ref}>
      <div
        className="relative h-8 transition-all"
        style={{ marginLeft: `${level * 5}px` }}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-400 hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:not(:has(*:hover)) group rounded-sm ${
            data?.id === activeWorkspaceId
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent" asChild>
              <Link className="ml-7" href={currentPath}>
                {data?.emoji ? <span>{data.emoji}</span> : <span>📝</span>}
                <span>
                  {workspaceNames.get(data!.id) &&
                  workspaceNames.get(data!.id)!.length > 11
                    ? workspaceNames.get(data!.id)?.substring(0, 11) + "..."
                    : workspaceNames.get(data!.id)!}
                </span>
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
            <div className="transition-all hover:bg-[#27272a] duration-250">
              <WorkspaceActions documentId={data!.id} parentId={currentPath} />
            </div>
          </SidebarMenuItem>
        </div>
        <div
          className={`flex justify-center absolute inset-0 transition-opacity duration-400 ${
            data?.id === activeWorkspaceId
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Input
            className="h-8 w-11/12 border-none transition-shadow/scale duration-500 bg-background shadow-[0_0_15px_10px] shadow-blue-500/50 focus-visible:scale-105 focus-visible:shadow-[0_0_15px_13px] focus-visible:shadow-blue-500/50 focus-visible:ring-0"
            placeholder="Rename..."
            value={workspaceNames.get(data!.id) ?? "Untitled"}
            onChange={handleOnChange}
            onKeyDown={handleOnEnter}
          />
        </div>
      </div>
      <CollapsibleContent>
        {data?.children &&
          data.children.map((post) => (
            <Workspace
              data={post}
              parentUrl={currentPath}
              key={post?.id}
              level={level + 1}
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
