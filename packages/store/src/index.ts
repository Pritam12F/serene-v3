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

  workspaceNames: Map<string, string>;
  setWorkspaceName: (id: string, newName: string) => void;
  getWorkspaceName: (id: string) => string | undefined;
  removeWorkspaceName: (id: string) => void;

  workspaceEmojis: Map<string, string>;
  setWorkspaceEmoji: (id: string, newEmoji: string) => void;
  getWorkspaceEmoji: (id: string) => string | undefined;
  removeWorkspaceEmoji: (id: string) => void;

  workspaceCovers: Map<string, string>;
  setWorkspaceCover: (id: string, newCover: string) => void;
  getWorkspaceCover: (id: string) => string | undefined;
  removeWorkspaceCover: (id: string) => void;
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

  workspaceNames: new Map(),
  setWorkspaceName: (workspaceId, newName) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceNames);
      updatedRecord.set(workspaceId, newName);
      return { workspaceNames: updatedRecord };
    });
  },
  getWorkspaceName: (workspaceId) => {
    return get().workspaceNames.get(workspaceId);
  },
  removeWorkspaceName: (workspaceId) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceNames);
      updatedRecord.delete(workspaceId);
      return { workspaceNames: updatedRecord };
    });
  },

  workspaceEmojis: new Map(),
  setWorkspaceEmoji: (workspaceId, newEmoji) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceEmojis);
      updatedRecord.set(workspaceId, newEmoji);
      return { workspaceEmojis: updatedRecord };
    });
  },
  getWorkspaceEmoji: (workspaceId) => {
    return get().workspaceEmojis.get(workspaceId);
  },
  removeWorkspaceEmoji: (workspaceId) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceEmojis);
      updatedRecord.delete(workspaceId);
      return { workspaceEmojis: updatedRecord };
    });
  },

  workspaceCovers: new Map(),
  setWorkspaceCover: (workspaceId, newCover) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceCovers);
      updatedRecord.set(workspaceId, newCover);
      return { workspaceCovers: updatedRecord };
    });
  },
  getWorkspaceCover: (workspaceId) => {
    return get().workspaceCovers.get(workspaceId);
  },
  removeWorkspaceCover: (workspaceId) => {
    set((state) => {
      const updatedRecord = new Map(state.workspaceCovers);
      updatedRecord.delete(workspaceId);
      return { workspaceCovers: updatedRecord };
    });
  },
}));

export default function useStore() {
  return store((state) => state);
}
