"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import dynamic from "next/dynamic";
import { usePosts } from "@/hooks/use-posts";
import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import Loading from "./loading";
import { useJWT } from "@/hooks/useJWT";

export const SidebarExtension = ({
  documentList,
}: {
  documentList?: string[];
}) => {
  const Editor = dynamic(() => import("./editor"), {
    ssr: false,
  });
  useJWT();
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const postType =
    !documentList || documentList[0] === "newPost" ? "new" : "existing";
  const { data: session } = useSession();
  const { postList, isLoading } = usePosts(session?.user.email!, documentList);
  const lastUpdated = postList
    ?.filter((el) => {
      return el?.id === documentList![documentList!.length - 1];
    })[0]
    ?.updatedAt?.toDateString();

  return (
    <SidebarInset className="bg-white h-screen overflow-y-hidden dark:bg-gray-950">
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {postList?.map((post, index) => {
                const urlIndex = documentList?.findIndex(
                  (el) => el === String(post?.id)
                );

                const breadCrumbUrl = documentList
                  ?.slice(0, urlIndex)
                  .map((docu) => {
                    return `/${docu}`;
                  })
                  .join("");

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
                  <Fragment key={index}>
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink
                        className="line-clamp-1"
                        href={`/documents/${breadCrumbUrl}/${post?.id!}`}
                      >
                        {post?.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {lastUpdated && (
          <div className="hidden md:block mx-8 text-sm">
            Last edited on {lastUpdated}
          </div>
        )}
      </header>
      {documentList && postList?.length === 0 && (
        <div className="h-screen w-full flex flex-col items-center">
          <div className="text-2xl md:text-4xl my-48">
            No such post exists...
          </div>
          <Link href={"/documents/newPost"}>
            <Button>Create new post</Button>
          </Link>
        </div>
      )}
      {!documentList && (
        <div className="h-screen w-full flex flex-col items-center">
          <div className="text-2xl md:text-4xl my-48">No post selected...</div>
          <Link href={"/documents/newPost"}>
            <Button>Create new post</Button>
          </Link>
        </div>
      )}
      {documentList && postList?.length !== 0 && (
        <Editor
          editable={true}
          postId={postList ? postList[postList.length - 1]?.id : null}
          initialContent={
            postList ? postList[postList.length - 1]?.content : null
          }
          onReady={setIsEditorReady}
          isReady={isEditorReady}
          type={postType}
        />
      )}
      {(!isEditorReady || isLoading) && documentList && <Loading />}
    </SidebarInset>
  );
};
