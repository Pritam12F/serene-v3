import { fetchAllPostsByUserId, fetchUserByClerkId } from "@/server/actions";
import { SelectManyPostType } from "@workspace/common/types/db";
import arrayToTree from "array-to-tree";
import { useCallback, useEffect, useState } from "react";

export const useWorkspaces = (user_id: string, documentList?: string[]) => {
  const [postData, setPostData] = useState<{
    tree: arrayToTree.Tree<SelectManyPostType>;
    list: SelectManyPostType | undefined;
  }>();
  const [postList, setPostList] = useState<SelectManyPostType | undefined>();
  const [postTree, setPostTree] =
    useState<arrayToTree.Tree<SelectManyPostType>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedUser = await fetchUserByClerkId(user_id);
      const fetchedPosts = await fetchAllPostsByUserId(fetchedUser.data!.id);

      if (fetchedUser.success && fetchedPosts.success && fetchedPosts.data) {
        const tree = arrayToTree(fetchedPosts.data, {
          parentProperty: "parentId",
        });
        setPostData({ tree, list: fetchedPosts.data });
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const error =
        err instanceof Error
          ? err.message
          : "Error occured trying to fetch posts";
      setError(error);
    }
  }, [user_id]);

  useEffect(() => {
    fetchWorkspaces();
  }, [user_id]);

  const mutate = useCallback(async () => {
    await fetchWorkspaces();
  }, []);

  useEffect(() => {
    setPostTree(postData?.tree);
    if (documentList && postData?.list) {
      const filtered = postData?.list.filter((x) =>
        documentList.includes(x!.id.toString())
      );

      setPostList(filtered);
    }
  }, [documentList, postData?.tree, postData?.list]);

  return { postTree, postList, isLoading, error, mutate };
};
