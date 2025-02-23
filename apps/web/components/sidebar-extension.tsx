"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { NavActions } from "./nav-actions";
import dynamic from "next/dynamic";
import { useWorkspaces } from "@/hooks/use-workspaces";

export const SidebarExtension = ({
  children,
  documentList,
}: {
  children?: React.ReactNode;
  documentList?: string[];
}) => {
  const Editor = dynamic(() => import("./editor"), { ssr: false });
  const { workspaces } = useWorkspaces(documentList);

  return (
    <SidebarInset className="bg-white h-screen overflow-y-hidden dark:bg-[#282b32]">
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {workspaces?.map((workspace, index) => {
                if (index === workspaces.length - 1) {
                  return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage className="line-clamp-1">
                        {workspace?.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                }

                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink className="line-clamp-1">
                      {workspace?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      <Editor
        onChange={() => {}}
        editable={true}
        initialContent={
          workspaces ? workspaces[workspaces.length - 1]?.content : null
        }
        title={
          workspaces ? workspaces[workspaces.length - 1]?.name : "Untitled"
        }
      />
    </SidebarInset>
  );
};
