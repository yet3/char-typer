import type { TStoreSlice } from "./root.store";

interface ILiveStatsSliceState {
  cps: number;
}

interface ILiveStatsSliceActions {
  resetState: () => void;
  setCps: (cps: number) => void;
}

export type ILiveStatsSlice = {
  liveStats: ILiveStatsSliceState & ILiveStatsSliceActions;
};

const liveStatsInitState: ILiveStatsSliceState = {
  cps: 0,
};

export const createLiveStatsSlice: TStoreSlice<ILiveStatsSlice> = (set) => ({
  liveStats: {
    ...liveStatsInitState,
    resetState: () => {
      set((s) => {
        s.liveStats = {
          ...s.liveStats,
          ...liveStatsInitState,
        };
      });
    },

    setCps: (cps) => {
      set((s) => {
        s.liveStats.cps = cps;
      });
    },
  },
});
