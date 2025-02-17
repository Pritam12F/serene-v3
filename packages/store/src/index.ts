import { create } from "zustand";

interface StoreType {
  mutator: (() => void) | null;
  changeMutator: (myMutator: () => void) => void;
  activeRenameId: number | null;
  changeActiveRenameId: (id?: number | null) => void;
}

const useStore = create<StoreType>((set) => ({
  mutator: null,
  changeMutator: (myMutator: () => void) => set({ mutator: myMutator }),

  activeRenameId: null,
  changeActiveRenameId: (id) => set({ activeRenameId: id }),
}));

export default useStore;
