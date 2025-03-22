import * as React from "react";
import { AudioWaveform, Command, Home, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { SidebarMain } from "./sidebar-main";
import { SidebarCollaborativeWorkspaces } from "./sidebar-favorites";
import { SidebarWorkspaces } from "./sidebar-workspaces";
import { SidebarUser } from "./sidebar-user";

const data = {
  navMain: [
    {
      title: "Search",
      url: "/documents/search",
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
        <SidebarWorkspaces />
        <SidebarCollaborativeWorkspaces />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
