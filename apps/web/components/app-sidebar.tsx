import * as React from "react";
import { Home, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { SidebarMain } from "./sidebar-main";
import { SidebarWorkspaces } from "./sidebar-workspaces";
import { SidebarPosts } from "./sidebar-posts";
import { SidebarUser } from "./sidebar-user";

const data = {
  navMain: [
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="border-r-0 dark:bg-gray-950"
      {...props}
      variant="floating"
    >
      <SidebarHeader>
        <SidebarUser />
        <SidebarMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarPosts />
        <SidebarWorkspaces />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
