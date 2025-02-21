import { fetchSinglePostById } from "@/server/actions";
import { SelectPostType } from "@workspace/common/types/db";
import useStore from "@workspace/store";
import { useEffect, useState } from "react";

export const useWorkspaces = (documentList?: string[]) => {
  const [workspaces, setWorkspaces] = useState<SelectPostType[] | undefined>(
    []
  );
  const { getWorkspace, setWorkspace } = useStore();

  useEffect(() => {
    const inStatePosts = documentList?.map((docId) =>
      getWorkspace(Number(docId))
    );

    if (inStatePosts?.length === 1 && !inStatePosts[0]) {
      const fetchPosts = async () => {
        const fetchedPosts = await Promise.all(
          documentList!.map(async (docId) => {
            const post = await fetchSinglePostById(Number(docId));
            setWorkspace(Number(docId), post.data!);
            return post.data!;
          })
        );

        setWorkspaces(fetchedPosts);
      };

      fetchPosts();
    }

    setWorkspaces(inStatePosts);
  }, [documentList]);

  return { workspaces };
};
