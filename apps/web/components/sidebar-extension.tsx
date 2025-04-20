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
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "./loading";
import { useJWT } from "@/hooks/useJWT";
import { NavActions } from "./nav-actions";
import { SelectPostType } from "@workspace/common/types/db";
import { fetchAllPublicPosts } from "@/server";
import NotFound from "./not-found";
import { useRouter } from "next/navigation";

export const SidebarExtension = ({
  documentList,
}: {
  documentList?: string[];
}) => {
  const Editor = dynamic(() => import("./editor"), {
    ssr: false,
  });
  useJWT();
  const router = useRouter();
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const [sharedPost, setSharedPost] = useState<SelectPostType>();
  const postType =
    !documentList || documentList[0] === "newPost" ? "new" : "existing";
  const { data: session } = useSession();
  const { postList, isLoading } = usePosts(session?.user.email!, documentList);
  const lastUpdated = postList
    ?.filter((el) => {
      return el?.id === documentList![documentList!.length - 1];
    })[0]
    ?.updatedAt?.toDateString()
    .split(" ");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchAllPublicPosts();

      setSharedPost(
        data?.filter(
          (x) => x?.id === documentList![documentList!.length - 1]
        )[0]
      );
    };

    fetch();
  }, []);

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
        {documentList && postList?.length! > 0 && (
          <NavActions
            month={lastUpdated?.[2]!}
            day={lastUpdated?.[1]!}
            postId={postList ? postList[postList.length - 1]?.id : null}
          />
        )}
      </header>
      {documentList && postList?.length === 0 && !sharedPost && (
        <NotFound
          title="No such post exists"
          btnContent="Create a New Post"
          btnAction={() => {
            router.push("/documents/newPost");
          }}
        />
      )}
      {!documentList && (
        <NotFound
          title="No post selected"
          btnContent="Create a New Post"
          btnAction={() => {
            router.push("/documents/newPost");
          }}
        />
      )}
      {documentList && (postList?.length !== 0 || sharedPost) && (
        <Editor
          editable={postList?.length ? true : false}
          postId={
            postList?.length
              ? postList[postList.length - 1]?.id
              : sharedPost?.id
          }
          initialContent={
            postList?.length
              ? postList[postList.length - 1]?.content
              : sharedPost?.content
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
