import { fetchAllUserWorkspaces } from "@/server/workspace";
import { SelectManyWorkspaceType } from "@workspace/common/types/db";
import useStore from "@workspace/store";
import { useCallback, useEffect, useState } from "react";

export const useWorkspace = () => {
  const [mainWorkspaces, setMainWorkspaces] = useState<SelectManyWorkspaceType>(
    []
  );
  const [secondaryWorkspaces, setSecondaryWorkspaces] =
    useState<SelectManyWorkspaceType>([]);
  const { setWorkspaceCover, setWorkspaceName, setWorkspaceEmoji } = useStore();

  const mutator = useCallback(async () => {
    const work_spaces = await fetchAllUserWorkspaces();

    setMainWorkspaces([...work_spaces.data?.mainWorkspaces!]);

    setSecondaryWorkspaces([...work_spaces.data?.secondaryWorkspaces!]);

    work_spaces.data?.mainWorkspaces?.map((workspace) => {
      setWorkspaceCover(workspace?.id!, workspace?.coverImage?.url!);
      setWorkspaceName(workspace?.id!, workspace?.name!);
      setWorkspaceEmoji(workspace?.id!, workspace?.emoji!);
    });

    work_spaces.data?.secondaryWorkspaces?.map((workspace) => {
      setWorkspaceCover(workspace?.id!, workspace?.coverImage?.url!);
      setWorkspaceName(workspace?.id!, workspace?.name!);
      setWorkspaceEmoji(workspace?.id!, workspace?.emoji!);
    });
  }, []);

  useEffect(() => {
    mutator();
  }, []);

  return { mainWorkspaces, secondaryWorkspaces, mutator };
};
