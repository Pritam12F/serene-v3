import { create } from "zustand";

interface StoreType {
  mutator: (() => void) | undefined;
  changeMutator: (myMutator: () => void) => void;
}

const useStore = create<StoreType>((set) => ({
  mutator: undefined,
  changeMutator: (myMutator: () => void) => set({ mutator: myMutator }),
}));

export default useStore;
