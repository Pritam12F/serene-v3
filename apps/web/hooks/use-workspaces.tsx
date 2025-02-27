import { fetchAllPostsByUserId, fetchUserByClerkId } from "@/server/actions";
import { SelectManyPostType } from "@workspace/common/types/db";
import arrayToTree from "array-to-tree";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const useWorkspaces = (user_id: string, documentList?: string[]) => {
  const { data, mutate, isLoading } = useSWR(
    `${user_id}/workspaces`,
    async () => {
      const fetchedUser = await fetchUserByClerkId(user_id);
      const fetchedPosts = await fetchAllPostsByUserId(fetchedUser.data!.id);

      if (fetchedUser.success && fetchedPosts.success && fetchedPosts.data) {
        return {
          tree: arrayToTree(fetchedPosts.data, { parentProperty: "parentId" }),
          list: fetchedPosts.data,
        };
      }
      return { tree: [], list: [] };
    }
  );

  const [postTree, setPostTree] =
    useState<arrayToTree.Tree<SelectManyPostType>>();
  const [postList, setPostList] = useState<SelectManyPostType | undefined>([]);

  useEffect(() => {
    setPostTree(data?.tree);

    if (documentList && data?.list) {
      const filtered = data?.list.filter((x) =>
        documentList.includes(x.id.toString())
      );

      setPostList(filtered);
    }
  }, [data?.tree, data?.list, documentList]);

  return { postTree, postList, mutate, isLoading };
};
