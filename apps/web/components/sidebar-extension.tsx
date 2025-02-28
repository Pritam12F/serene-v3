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
import { useUser } from "@clerk/nextjs";
import Loading from "@/app/(main)/documents/[[...slug]]/loading";

export const SidebarExtension = ({
  children,
  documentList,
}: {
  children?: React.ReactNode;
  documentList?: string[];
}) => {
  const Editor = dynamic(() => import("./editor"), {
    ssr: false,
    loading: () => <Loading />,
  });

  const { user, isLoaded } = useUser();

  const { postList, isLoading } = useWorkspaces(user?.id!, documentList);

  if (!isLoaded && isLoading) {
    return <Loading />;
  }

  return (
    <SidebarInset className="bg-white h-screen overflow-y-hidden dark:bg-[#282b32]">
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {postList?.map((post, index) => {
                if (index === postList.length - 1) {
                  return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage className="line-clamp-1">
                        {post?.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                }

                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink className="line-clamp-1">
                      {post?.name}
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
        editable={true}
        postId={postList ? postList[postList.length - 1]?.id : null}
        initialContent={
          postList ? postList[postList.length - 1]?.content : null
        }
        title={postList ? postList[postList.length - 1]?.name : "Untitled"}
      />
    </SidebarInset>
  );
};
