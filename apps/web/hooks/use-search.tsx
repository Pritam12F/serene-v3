import { useSession } from "next-auth/react";
import { usePosts } from "./use-posts";
import { useWorkspace } from "./use-workspaces";
import { useEffect, useMemo, useState } from "react";
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
  const existingIds = useMemo(() => new Set<string>(), []);

  const fuse = useMemo(
    () =>
      new Fuse(initialResults ?? [], {
        keys: ["name", "content"],
      }),
    [initialResults]
  );

  useEffect(() => {
    allPosts?.forEach((post) => {
      if (!existingIds.has(post?.id!)) {
        setInitialResults((prev) => [
          ...(prev ?? []),
          post as SearchResultType,
        ]);
        existingIds.add(post?.id!);
      }
    });

    mainWorkspaces?.forEach((workspace) => {
      if (!existingIds.has(workspace?.id!)) {
        setInitialResults((prev) => [
          ...(prev ?? []),
          workspace as SearchResultType,
        ]);
        existingIds.add(workspace?.id!);
      }
    });

    secondaryWorkspaces?.forEach((workspace) => {
      if (!existingIds.has(workspace?.id!)) {
        setInitialResults((prev) => [
          ...(prev ?? []),
          workspace as SearchResultType,
        ]);
        existingIds.add(workspace?.id!);
      }
    });
  }, [mainWorkspaces, secondaryWorkspaces, allPosts]);

  useEffect(() => {
    if (initialResults && searchTerm) {
      const filtered = fuse.search(searchTerm).map((x) => x.item);

      setSearchResults([...filtered]);
      return;
    }
  }, [searchTerm]);

  return { initialResults, searchResults };
};
