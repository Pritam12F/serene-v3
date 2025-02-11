import { createContext } from "react";

interface WorkspaceContextType {
  mutate: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider = ({
  children,
  mutate,
}: {
  children: React.ReactNode;
  mutate: () => void;
}) => {
  return (
    <WorkspaceContext.Provider value={{ mutate }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
