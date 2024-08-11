import type { TStoreSlice } from "./root.store";

interface IDebugSliceState {
  isOpen: boolean;
}

interface IDebugSliceActions {
  toggleOpen: () => void;
}

export type IDebugSlice = { debug: IDebugSliceState & IDebugSliceActions };

const debugInitState: IDebugSliceState = {
  isOpen: false,
};

export const createDebugSlice: TStoreSlice<IDebugSlice> = (set) => ({
  debug: {
    ...debugInitState,

    toggleOpen: () => {
      set((s) => {
        s.debug.isOpen = !s.debug.isOpen;
      });
    },
  },
});
