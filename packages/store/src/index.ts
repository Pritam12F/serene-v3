import { create } from "zustand";

interface StoreType {
  mutator: (() => void) | null;
  changeMutator: (myMutator: () => void) => void;

  activePostId: number | null;
  changeActivePostId: (id?: number | null) => void;

  postNames: Map<number, string>;
  setPostName: (id: number, newName: string) => void;
  getPostName: (id: number) => string | undefined;
  removePostName: (id: number) => void;

  postContent: Map<number, any>;
  setPostContent: (id: number, newContent: any) => void;
  getPostContent: (id: number) => any;
  removePostContent: (id: number) => void;
}

export const store = create<StoreType>((set, get) => ({
  mutator: null,
  changeMutator: (myMutator: () => void) => set({ mutator: myMutator }),

  activePostId: null,
  changeActivePostId: (id) => set({ activePostId: id }),

  postNames: new Map(),
  setPostName: (postId, newName) => {
    set((state) => {
      const updatedRecord = new Map(state.postNames);
      updatedRecord.set(postId, newName);
      return { postNames: updatedRecord };
    });
  },
  getPostName: (postId) => {
    return get().postNames.get(postId);
  },
  removePostName: (postId: number) => {
    set((state) => {
      const updatedRecord = new Map(state.postNames);
      updatedRecord.delete(postId);
      return { postNames: updatedRecord };
    });
  },

  postContent: new Map(),
  setPostContent: (postId, newContent) => {
    set((state) => {
      const updatedRecord = new Map(state.postContent);
      updatedRecord.set(postId, newContent);
      return { postContent: updatedRecord };
    });
  },
  getPostContent: (postId) => {
    return get().postContent.get(postId);
  },
  removePostContent: (postId: number) => {
    set((state) => {
      const updatedRecord = new Map(state.postContent);
      updatedRecord.delete(postId);
      return { postContent: updatedRecord };
    });
  },
}));

export default function useStore() {
  return store((state) => state);
}
