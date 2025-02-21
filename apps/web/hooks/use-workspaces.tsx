import { SelectPostType } from "@workspace/common/types/db";
import useStore from "@workspace/store";
import { useEffect, useState } from "react";

export const useWorkspaces = (documentList?: string[]) => {
  const [workspaces, setWorkspaces] = useState<SelectPostType[] | undefined>(
    []
  );
  const { getWorkspace } = useStore();

  useEffect(() => {
    const fetchedPosts = documentList?.map((docId) =>
      getWorkspace(Number(docId))
    );

    setWorkspaces(fetchedPosts);
  }, [documentList]);

  return { workspaces };
};
