import { fetchAllPostsByUserId } from "@/server";
import { SelectManyPostType } from "@workspace/common/types/db";
import arrayToTree from "array-to-tree";
import { useCallback, useEffect, useState } from "react";

export const usePosts = (user_email: string, documentList?: string[]) => {
  const [postData, setPostData] = useState<{
    tree: arrayToTree.Tree<SelectManyPostType>;
    list: SelectManyPostType | undefined;
  }>();
  const [postList, setPostList] = useState<SelectManyPostType | undefined>();
  const [postTree, setPostTree] =
    useState<arrayToTree.Tree<SelectManyPostType>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [allPosts, setAllPosts] = useState<SelectManyPostType>([]);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await fetchAllPostsByUserId();

      if (fetchedPosts.success && fetchedPosts.data) {
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
  }, [user_email]);

  useEffect(() => {
    fetchPosts();
  }, [user_email]);

  const mutate = useCallback(async () => {
    await fetchPosts();
  }, []);

  useEffect(() => {
    setPostTree(postData?.tree);
    if (documentList && postData?.list) {
      const filtered = postData?.list.filter((x) =>
        documentList.includes(x!.id.toString())
      );

      setPostList(filtered);
    }

    setAllPosts(postData?.list!);
  }, [documentList, postData?.tree, postData?.list]);

  return { postTree, postList, allPosts, isLoading, error, mutate };
};
