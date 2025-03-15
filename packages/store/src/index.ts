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

  workspaceContent: Map<number, any>;
  setWorkspaceContent: (id: number, newContent: any) => void;
  getWorkspaceContent: (id: number) => any;
  removeWorkspaceContent: (id: number) => void;
}

export const store = create<StoreType>((set, get) => ({
  mutator: null,
  changeMutator: (myMutator: () => void) => set({ mutator: myMutator }),

  activeWorkspaceId: null,
  changeActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

  workspaceNames: new Map(),
  setWorkspaceName: (postId, newName) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceNames); // Ensure immutability
      updatedRecord.set(postId, newName);
      return { workspaceNames: updatedRecord };
    });
  },
  getWorkspaceName: (postId) => {
    return get().workspaceNames.get(postId);
  },
  removeWorkspaceName: (postId: number) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceNames);
      updatedRecord.delete(postId);
      return { workspaceNames: updatedRecord };
    });
  },

  workspaceContent: new Map(),
  setWorkspaceContent: (postId, newContent) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceContent);
      updatedRecord.set(postId, newContent);
      return { workspaceContent: updatedRecord };
    });
  },
  getWorkspaceContent: (postId) => {
    return get().workspaceContent.get(postId);
  },
  removeWorkspaceContent: (postId: number) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceContent);
      updatedRecord.delete(postId);
      return { workspaceContent: updatedRecord };
    });
  },
}));

export default function useStore() {
  return store((state) => state);
}
