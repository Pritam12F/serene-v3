"use client";

import {
  ArrowUpRight,
  MoreHorizontal,
  StarOff,
  Link as LinkIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { useFavorites } from "@/hooks/use-favorites";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import useStore from "@workspace/store";
import { removeFromFavorite } from "@/server";
import { toast } from "sonner";
import {
  SelectManyPostType,
  SelectWorkspaceType,
} from "@workspace/common/types/db";
import { removeWorkspaceFromFavorites } from "@/server/workspace";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function SidebarFavorites() {
  const { changeFavoriteMutator } = useStore();
  const isMobile = useIsMobile();

  const { postFavorites, workspaceFavorites, fetchFavorites } = useFavorites();
  const { favoriteMutator } = useStore();

  const handleRemovePostFavorite = useCallback(async (postId: string) => {
    const { success, message } = await removeFromFavorite(postId);

    if (success) {
      toast(message, {
        style: {
          backgroundColor: "#38b000",
        },
      });

      favoriteMutator?.();
    } else {
      toast(message, {
        style: {
          backgroundColor: "red",
        },
      });
    }
  }, []);

  const handleRemoveWorkspaceFavorite = useCallback(
    async (workspaceId: string) => {
      const { success, message } =
        await removeWorkspaceFromFavorites(workspaceId);

      if (success) {
        toast(message, {
          style: {
            backgroundColor: "#38b000",
          },
        });

        favoriteMutator?.();
      } else {
        toast(message, {
          style: {
            backgroundColor: "red",
          },
        });
      }
    },
    []
  );

  useEffect(() => {
    changeFavoriteMutator(fetchFavorites);
  }, [fetchFavorites]);

  if (postFavorites?.length! > 0 || workspaceFavorites?.length! > 0) {
    return null;
  }
  <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    <>
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        <PostFavorites
          postFavorites={postFavorites ?? []}
          handleRemoveAction={handleRemovePostFavorite}
        />
        <WorkspaceFavorites
          workspaceFavorites={workspaceFavorites ?? []}
          handleRemoveAction={handleRemoveWorkspaceFavorite}
        />
      </SidebarMenu>
    </>
  </SidebarGroup>;
}

export const PostFavorites = ({
  postFavorites,

  handleRemoveAction,
}: {
  postFavorites: SelectManyPostType;

  handleRemoveAction: (postId: string) => Promise<void>;
}) => {
  const { isMobile } = useSidebar();

  return postFavorites.map((item, index) => {
    return (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton className="px-9" asChild>
          <Link href={`/documents/${item?.id}`}>
            <span>{item?.emoji ?? "📝"}</span>
            <span>{item?.name}</span>
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem
              onClick={async () => {
                await handleRemoveAction(item?.id!);
              }}
              className="cursor-pointer"
            >
              <StarOff className="text-orange-500 dark:text-orange-300" />
              <span>Remove from Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async (e) => {
                e.preventDefault();

                await navigator.clipboard.writeText(
                  `${window.origin}/documents/${item?.id}`
                );

                if (!isMobile) {
                  toast("Copied link!");
                }
              }}
            >
              <LinkIcon className="text-muted-foreground" />
              <span>Copy Link</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.open(`/documents/${item?.id}`, "_blank", "noopener");
              }}
            >
              <ArrowUpRight className="text-muted-foreground" />
              <span>Open in New Tab</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  });
};

export const WorkspaceFavorites = ({
  workspaceFavorites,
  handleRemoveAction,
}: {
  workspaceFavorites: SelectWorkspaceType[];
  handleRemoveAction: (workspaceId: string) => Promise<void>;
}) => {
  const { isMobile } = useSidebar();

  return workspaceFavorites.map((item, index) => {
    return (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton className="px-9" asChild>
          <Link href={`/documents/${item?.id}`}>
            <span>{item?.emoji ?? "📝"}</span>
            <span>{item?.name}</span>
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem
              onClick={async () => {
                await handleRemoveAction(item?.id!);
              }}
              className="cursor-pointer"
            >
              <StarOff className="text-orange-500 dark:text-orange-300" />
              <span>Remove from Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async (e) => {
                e.preventDefault();

                await navigator.clipboard.writeText(
                  `${window.origin}/workspaces/${item?.id}`
                );

                toast("Copied link!");
              }}
            >
              <LinkIcon className="text-muted-foreground" />
              <span>Copy Link</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                window.open(`/workspaces/${item?.id}`, "_blank", "noopener");
              }}
              className="cursor-pointer"
            >
              <ArrowUpRight className="text-muted-foreground" />
              <span>Open in New Tab</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  });
};
