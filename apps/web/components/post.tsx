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
import { type SelectPostType } from "@workspace/common/types/db";
import Link from "next/link";
import useStore from "@workspace/store";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { changePostNameById } from "@/server";
import useDebounce from "@/hooks/use-debounce";
import { toast } from "sonner";
import { PostActions } from "./post-actions";

interface PostProps {
  data: SelectPostType;
  level?: number;
  parentUrl?: string;
}

export const Post = ({ data, level = 0, parentUrl }: PostProps) => {
  const {
    activePostId,
    postNames,
    mutator,
    favoriteMutator,
    changeActivePostId,
    setPostName,
  } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const debouncedRenamePost = useDebounce(
    async (postId: string, newName: string) => {
      await changePostNameById(postId, newName);
      mutator?.();
      favoriteMutator?.();
    },
    5000
  );

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setPostName(data!.id, e.target?.value ?? "Unknown");
    debouncedRenamePost(data!.id, e.target.value);
    data!.name = e.target.value;
  };

  const handleOnEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const res = await changePostNameById(data!.id, postNames.get(data!.id)!);

      if (res.success) {
        toast.success("Post renamed successfully", {
          style: { backgroundColor: "#38b000" },
        });
      }
      data!.name = postNames.get(data!.id) ?? "Unknown";
      mutator?.();
      favoriteMutator?.();
      changeActivePostId(null);
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
    setPostName(data!.id, data?.name ?? "Untitled");
  }, [activePostId]);

  return (
    <Collapsible id={data?.id as unknown as string} ref={ref}>
      <div
        className="relative h-8 transition-all"
        style={{ marginLeft: `${level * 5}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-400 hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:not(:has(*:hover)) group rounded-sm ${
            data?.id === activePostId
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent" asChild>
              <Link className="ml-7" href={currentPath}>
                {data?.emoji ? <span>{data.emoji}</span> : <span>📝</span>}
                <span>
                  {postNames.get(data!.id) &&
                  postNames.get(data!.id)!.length > 11
                    ? postNames.get(data!.id)?.substring(0, 11) + "..."
                    : postNames.get(data!.id)!}
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
              <PostActions
                documentId={data!.id}
                parentId={currentPath}
                isHovered={isHovered}
              />
            </div>
          </SidebarMenuItem>
        </div>
        <div
          className={`flex justify-center absolute inset-0 transition-opacity duration-400 ${
            data?.id === activePostId
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Input
            className="h-8 w-11/12 border-none transition-shadow/scale duration-500 bg-background shadow-[0_0_15px_10px] shadow-blue-500/50 focus-visible:scale-105 focus-visible:shadow-[0_0_15px_13px] focus-visible:shadow-blue-500/50 focus-visible:ring-0"
            placeholder="Rename..."
            value={postNames.get(data!.id) ?? "Untitled"}
            onChange={handleOnChange}
            onKeyDown={handleOnEnter}
          />
        </div>
      </div>
      <CollapsibleContent>
        {data?.children &&
          data.children.map((post) => (
            <Post
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
