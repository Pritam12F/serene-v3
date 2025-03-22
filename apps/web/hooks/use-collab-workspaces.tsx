import { fetchUserByEmail } from "@/server";
import { fetchAllUserWorkspaces } from "@/server/workspace";
import {
  SelectManySecondaryWorkspaceUserType,
  SelectManyWorkspaceType,
} from "@workspace/common/types/db";
import { useCallback, useEffect, useState } from "react";

export const useCollabWorkspace = () => {
  const [mainWorkspaces, setMainWorkspaces] = useState<SelectManyWorkspaceType>(
    []
  );
  const [secondaryWorkspaces, setSecondaryWorkspaces] =
    useState<SelectManySecondaryWorkspaceUserType>([]);

  const mutator = useCallback(async () => {
    const { data } = await fetchUserByEmail();
    const work_spaces = await fetchAllUserWorkspaces(data?.id);

    setMainWorkspaces((prev) => [
      ...prev,
      ...(work_spaces.data?.mainWorkspaces ?? []),
    ]);

    setSecondaryWorkspaces((prev) => [
      ...prev,
      ...(work_spaces.data?.secondaryWorkspaces ?? []),
    ]);
  }, []);

  useEffect(() => {
    mutator();
  }, []);

  return { mainWorkspaces, secondaryWorkspaces, mutator };
};
