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
import { NavActions } from "./nav-actions";
import dynamic from "next/dynamic";
import { useWorkspaces } from "@/hooks/use-workspaces";
import Loading from "@/app/(main)/documents/[[...slug]]/loading";
import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import useStore, { store } from "@workspace/store";
import { createNewPost } from "@/server/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const SidebarExtension = ({
  children,
  documentList,
}: {
  children?: React.ReactNode;
  documentList?: string[];
}) => {
  const Editor = dynamic(() => import("./editor"), {
    ssr: false,
  });
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const params = useSearchParams().get("parentId");
  const router = useRouter();
  const parentId = Number(
    decodeURIComponent(params ?? "")
      .split("/")
      .at(-1)
  );
  const getWorkspaceName = (id: number) =>
    store.getState().getWorkspaceName(id);
  const getWorkspaceContent = (id: number) =>
    store.getState().getWorkspaceContent(id);

  const postType =
    !documentList || documentList[0] === "newPost" ? "new" : "existing";
  const { data: session } = useSession();
  const { postList, isLoading } = useWorkspaces(
    session?.user.email!,
    documentList
  );

  const createPostHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const { success, message, data } = await createNewPost(
      getWorkspaceName(0) ?? "Untitled",
      getWorkspaceContent(0),
      parentId
    );

    if (success) {
      toast.success("Post created successfully!", {
        style: { backgroundColor: "#38b000" },
      });

      router.push(decodeURIComponent(params ?? "").concat(`/${data}`));
      store.getState().mutator?.();
      return;
    }

    toast.error("Error adding post", { style: { backgroundColor: "red" } });
    console.error(message);
  };

  return (
    <SidebarInset className="bg-white h-screen overflow-y-hidden dark:bg-gray-900">
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {postType === "existing" && (
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
                    <Fragment key={index}>
                      <BreadcrumbItem key={index}>
                        <BreadcrumbLink
                          className="line-clamp-1"
                          href={`/documents/${post?.id}`}
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
          )}
          {postType === "new" && <p>Create new post</p>}
        </div>
        <div className="ml-auto px-3">
          {postType === "existing" && <NavActions />}
          {postType === "new" && (
            <button
              type="button"
              className="mt-5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2"
              onClick={createPostHandler}
            >
              Create
            </button>
          )}
        </div>
      </header>
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
      {(!isEditorReady || isLoading) && <Loading />}
    </SidebarInset>
  );
};
