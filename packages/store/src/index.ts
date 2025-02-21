import { create } from "zustand";
import { type SelectPostType } from "@workspace/common/types/db";

interface StoreType {
  mutator: (() => void) | null;
  changeMutator: (myMutator: () => void) => void;
  activeWorkspaceId: number | null;
  changeActiveWorkspaceId: (id?: number | null) => void;
  workspaceState: Map<number, SelectPostType>;
  setWorkspace: (id: number, newState: SelectPostType) => void;
  getWorkspace: (id: number) => SelectPostType;
  removeWorkspace: (id: number) => void;
}

const useStore = create<StoreType>((set, get) => ({
  mutator: null,
  changeMutator: (myMutator: () => void) => set({ mutator: myMutator }),

  activeWorkspaceId: null,
  changeActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

  workspaceState: new Map(),
  setWorkspace: (postId, newState) => {
    set((state) => {
      const updatedState = new Map(state.workspaceState);
      updatedState.set(postId, newState);
      return { ...state, workspaceState: updatedState };
    });
  },
  getWorkspace: (postId) => {
    return get().workspaceState.get(postId);
  },
  removeWorkspace: (postId) => {
    set((state) => {
      const updatedState = new Map(state.workspaceState);
      updatedState.delete(postId);
      return { ...state, workspaceState: updatedState };
    });
  },
}));

export default useStore;
