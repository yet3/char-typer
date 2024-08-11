import { type StateCreator, create } from "zustand";
import { mutative } from "zustand-mutative";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { type IDebugSlice, createDebugSlice } from "./debug.slice";
import { type ILiveStatsSlice, createLiveStatsSlice } from "./liveStats.slice";
import { type IRunSlice, createRunSlice } from "./run.slice";
import { type ISettingsSlice, createSettingsSlice } from "./settings.slice";

export type IRootStore = IDebugSlice &
  ISettingsSlice &
  ILiveStatsSlice &
  IRunSlice;

export type TStoreSlice<T> = StateCreator<
  IRootStore,
  [["zustand/mutative", never]],
  [],
  T
>;

export const useAppStore = create<
  IRootStore,
  [
    ["zustand/subscribeWithSelector", never],
    ["zustand/persist", unknown],
    ["zustand/mutative", never],
  ]
>(
  subscribeWithSelector(
    persist(
      mutative((...a) => ({
        ...createDebugSlice(...a),
        ...createLiveStatsSlice(...a),
        ...createSettingsSlice(...a),
        ...createRunSlice(...a),
      })),
      {
        partialize: (state) => ({
          settings: {
            charsSettings: state.settings.charsSettings,
            runLength: state.settings.runLength,
            runType: state.settings.runType,
            selectedCaret: state.settings.selectedCaret,
          },
        }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          settings: {
            ...currentState.settings,
            ...(persistedState as IRootStore).settings,
          },
        }),
        name: "persisted-state-2",
      },
    ),
  ),
);

export const selectCanType = (s: IRootStore) => {
  return (
    s.run.segments.length > 0 &&
    Object.values(s.settings.charsSettings).includes(true)
  );
};
