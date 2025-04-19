"use client";

import { Link, MoreHorizontal, Star, Users } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Switch } from "@workspace/ui/components/switch";
import { useEffect, useState } from "react";
import { fetchSinglePostById, makePostPrivate, makePostPublic } from "@/server";
import { toast } from "sonner";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function NavActions({
  month,
  day,
  postId,
}: {
  month: string;
  day: string;
  postId?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isPublic, setIsPublic] = useState(false);

  const handleMakePublic = async () => {
    const { success, message } = await makePostPublic(postId!);

    if (success) {
      toast.success(message);
      return;
    }

    toast.error(message);
  };

  const handleMakePrivate = async () => {
    const { success, message } = await makePostPrivate(postId!);

    if (success) {
      toast.success(message);
      return;
    }

    toast.error(message);
  };

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchSinglePostById(postId!);

      setIsPublic(data?.isPublic!);
    };

    fetch();
  }, []);

  return (
    <div className="flex items-center gap-2 mx-4 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">
        Edit {month} {day}
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              <SidebarGroup className="border-b last:border-none">
                <SidebarGroupContent className="gap-0">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="flex items-center">
                        <Users className="text-muted-foreground" />
                        <span>Make Public</span>
                        <Switch
                          className="ml-11"
                          checked={isPublic}
                          onCheckedChange={async (state) => {
                            if (state) {
                              setIsPublic(true);
                              await handleMakePublic();
                              return;
                            }

                            setIsPublic(false);
                            await handleMakePrivate();
                          }}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className="flex items-center"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `${window.origin}/documents/${postId}`
                          );

                          if (!isMobile) {
                            toast.info("Copied to clipboard");
                          }
                        }}
                      >
                        <Link className="text-muted-foreground" />
                        <span>Copy Link</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
