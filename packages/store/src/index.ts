import { create } from "zustand";

interface StoreType {
  mutator: (() => void) | null;
  changeMutator: (myMutator: () => void) => void;

  activePostId: string | null;
  changeActivePostId: (id?: string | null) => void;

  postNames: Map<string, string>;
  setPostName: (id: string, newName: string) => void;
  getPostName: (id: string) => string | undefined;
  removePostName: (id: string) => void;

  postContent: Map<string, any>;
  setPostContent: (id: string, newContent: any) => void;
  getPostContent: (id: string) => any;
  removePostContent: (id: string) => void;
}

export const store = create<StoreType>((set, get) => ({
  mutator: null,
  changeMutator: (myMutator) => set({ mutator: myMutator }),

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
  removePostName: (postId) => {
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
  removePostContent: (postId) => {
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
