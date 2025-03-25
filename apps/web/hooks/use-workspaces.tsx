import { fetchAllUserWorkspaces } from "@/server/workspace";
import { SelectManyWorkspaceType } from "@workspace/common/types/db";
import { useCallback, useEffect, useState } from "react";

export const useWorkspace = () => {
  const [mainWorkspaces, setMainWorkspaces] = useState<SelectManyWorkspaceType>(
    []
  );
  const [secondaryWorkspaces, setSecondaryWorkspaces] =
    useState<SelectManyWorkspaceType>([]);

  const mutator = useCallback(async () => {
    const work_spaces = await fetchAllUserWorkspaces();

    setMainWorkspaces([...work_spaces.data?.mainWorkspaces!]);

    setSecondaryWorkspaces([...work_spaces.data?.secondaryWorkspaces!]);
  }, []);

  useEffect(() => {
    mutator();
  }, []);

  return { mainWorkspaces, secondaryWorkspaces, mutator };
};
