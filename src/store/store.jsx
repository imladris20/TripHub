import { produce } from "immer";
import { create } from "zustand";

const initialState = 0;

const useStore = create((set, get) => ({
  bears: initialState,
  increasePopulation: () =>
    set(
      produce((state) => {
        state.bears = state.bears + 1;
      }),
    ),
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () =>
    set(
      produce((state) => {
        state.bears = 0;
      }),
    ),
}));

export default useStore;
