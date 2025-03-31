import { useSession } from "next-auth/react";
import { usePosts } from "./use-posts";
import { useWorkspace } from "./use-workspaces";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

interface SearchResultType {
  id: string;
  name: string | null;
  emoji: string | null;
  content?: any;
}

export const useSearch = (searchTerm?: string) => {
  const session = useSession();
  const { allPosts } = usePosts(session.data?.user.email!);
  const { mainWorkspaces, secondaryWorkspaces } = useWorkspace();
  const [initialResults, setInitialResults] = useState<
    SearchResultType[] | null
  >(null);
  const [searchResults, setSearchResults] = useState<SearchResultType[] | null>(
    null
  );

  useEffect(() => {
    if (initialResults && searchTerm) {
      const fuse = new Fuse(initialResults, {
        keys: ["name", "content"],
      });

      const filtered = fuse.search(searchTerm).map((x) => x.item);

      setSearchResults([...filtered]);
    }
    allPosts?.forEach((post) => {
      if (!initialResults?.find((x) => x.id === post?.id)) {
        setInitialResults((prev) => [
          ...(prev ?? []),
          post as SearchResultType,
        ]);
      }
    });

    mainWorkspaces?.forEach((workspace) => {
      if (!initialResults?.find((x) => x.id === workspace?.id)) {
        setInitialResults((prev) => [
          ...(prev ?? []),
          workspace as SearchResultType,
        ]);
      }
    });

    secondaryWorkspaces?.forEach((workspace) => {
      if (!initialResults?.find((x) => x.id === workspace?.id)) {
        setInitialResults((prev) => [
          ...(prev ?? []),
          workspace as SearchResultType,
        ]);
      }
    });
  }, [mainWorkspaces, secondaryWorkspaces, allPosts, searchTerm]);

  return { initialResults, searchResults };
};
