import { fetchAllFavoritePostsByUserId } from "@/server";
import { fetchFavoriteWorkspaces } from "@/server/workspace";
import {
  SelectManyPostType,
  SelectWorkspaceType,
} from "@workspace/common/types/db";
import { useCallback, useEffect, useState } from "react";

export const useFavorites = () => {
  const [postFavorites, setPostFavorites] = useState<
    SelectManyPostType | null | undefined
  >();
  const [workspaceFavorites, setWorkspaceFavorites] = useState<
    SelectWorkspaceType[] | null | undefined
  >([]);

  const fetchFavorites = useCallback(async () => {
    const { data: favoritePosts } = await fetchAllFavoritePostsByUserId();
    const { data: favoriteWorkspaces } = await fetchFavoriteWorkspaces();

    setPostFavorites([...(favoritePosts ?? [])]);
    setWorkspaceFavorites([...(favoriteWorkspaces ?? [])]);
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, []);

  return { postFavorites, workspaceFavorites, fetchFavorites };
};
