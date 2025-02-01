"use client";

import { UserButton } from "@clerk/nextjs";
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
import { Editor } from "./editor";

export const SidebarExtension = ({
  children,
  documents = [{ name: "Project Management & Task Tracking", href: "#" }],
}: {
  children?: React.ReactNode;
  documents: { name: string; href: string }[];
}) => {
  return (
    <SidebarInset className="bg-whiten dark:bg-[#1f1f1f]">
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {documents.map(({ name, href }, index) => {
                if (index === documents.length - 1) {
                  return (
                    <BreadcrumbItem>
                      <BreadcrumbPage className="line-clamp-1">
                        {name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                }

                return (
                  <BreadcrumbItem>
                    <BreadcrumbLink className="line-clamp-1" href={href}>
                      {name}
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
      <Editor onChange={() => {}} editable={true} />
    </SidebarInset>
  );
};
