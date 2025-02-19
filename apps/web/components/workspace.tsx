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
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { changePostNameById } from "@/server/actions";

interface WorkspaceProps {
  data: SelectPostType;
  level?: number;
}

export const Workspace = ({ data, level = 0 }: WorkspaceProps) => {
  const { activeRenameId, mutator, changeActiveRenameId } = useStore();
  const [inputValue, setInputValue] = useState<string>(data?.name ?? "");
  const ref = useRef<HTMLDivElement>(null);

  const debounce = (cb: (...args: any[]) => void, delay = 2500) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  const debouncedRenamePost = useMemo(
    () =>
      debounce(async (id: number, value: string) => {
        await changePostNameById(id, value ?? "Unknown");
      }),
    []
  );

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target?.value ?? "Unknown");
    debouncedRenamePost(data!.id, e.target.value);
  };

  const handleOnEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await changePostNameById(data!.id, inputValue);
      mutator?.();
      changeActiveRenameId(null);
    }
  };

  useEffect(() => {
    mutator?.();
  }, [activeRenameId]);

  return (
    <Collapsible id={data?.id as unknown as string} ref={ref}>
      <div
        className="relative h-8 transition-all"
        style={{ marginLeft: `${level * 5}px` }}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-400 ${
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
        <div
          className={`flex justify-center absolute inset-0 transition-opacity duration-400 ${
            data?.id === activeRenameId
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Input
            className="h-8 w-11/12 border-none transition-shadow/scale duration-500 bg-background shadow-[0_0_15px_10px] shadow-blue-500/50 focus-visible:scale-105 focus-visible:shadow-[0_0_15px_13px] focus-visible:shadow-blue-500/50 focus-visible:ring-0"
            placeholder="Rename..."
            value={inputValue}
            onChange={handleOnChange}
            onKeyDown={handleOnEnter}
          />
        </div>
      </div>
      <CollapsibleContent>
        {data?.children &&
          data.children.map((post) => (
            <Workspace data={post} key={post?.id} level={level + 1} />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
