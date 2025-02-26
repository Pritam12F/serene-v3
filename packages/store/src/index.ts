import { create } from "zustand";

interface StoreType {
  mutator: (() => void) | null;
  changeMutator: (myMutator: () => void) => void;
  activeWorkspaceId: number | null;
  changeActiveWorkspaceId: (id?: number | null) => void;
  workspaceNames: Map<number, string>;
  setWorkspaceName: (id: number, newName: string) => void;
  getWorkspaceName: (id: number) => string | undefined;
  removeWorkspaceName: (id: number) => void;
}

const useStore = create<StoreType>((set, get) => ({
  mutator: null,
  changeMutator: (myMutator: () => void) => set({ mutator: myMutator }),

  activeWorkspaceId: null,
  changeActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

  workspaceNames: new Map(),
  setWorkspaceName: (postId, newName) => {
    set((state) => {
      const updatedRecord = state.workspaceNames;
      updatedRecord.set(postId, newName);
      return { ...state, workspaceNames: updatedRecord };
    });
  },
  getWorkspaceName: (postId) => {
    return get().workspaceNames.get(postId);
  },
  removeWorkspaceName: (postId: number) => {
    set((state) => {
      const updatedRecord = state.workspaceNames;
      updatedRecord.delete(postId);
      return { ...state, workspaceNames: updatedRecord };
    });
  },
}));

export default useStore;
