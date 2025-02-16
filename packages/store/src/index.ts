import { create } from "zustand";

interface StoreType {
  mutator: (() => void) | null;
  changeMutator: (myMutator: () => void) => void;
  activeRenameId: number | null;
  changeActiveRenameId: (id?: number) => void;
  workspaceRefs: Set<HTMLElement>;
  registerWorkspaceRefs: (ref: HTMLElement | null) => void;
}

const useStore = create<StoreType>((set) => ({
  mutator: null,
  changeMutator: (myMutator: () => void) => set(() => ({ mutator: myMutator })),

  activeRenameId: null,
  changeActiveRenameId: (id?: number) => set(() => ({ activeRenameId: id })),

  workspaceRefs: new Set(),
  registerWorkspaceRefs: (ref) =>
    set((state) => {
      if (!ref) return {}; // Ignore null refs
      const updatedWorkspaces = new Set(state.workspaceRefs);
      updatedWorkspaces.add(ref);
      return { workspaceRefs: updatedWorkspaces };
    }),
}));

export default useStore;
